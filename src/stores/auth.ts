import { defineStore } from "pinia";
import type User from "../types/user";
import { auth, db, storage } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useOtpStore } from "./otp";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import type UpdateUserDetails from "../types/update_user_details/update_user_details";

onAuthStateChanged(auth, (user) => {
  const auth = useAuthStore();
  if (user) {
    const uid = user.uid;
    const phoneNumber = user.phoneNumber;
    // ...
    auth.uid = uid;
    auth.phoneNumber = phoneNumber;
  } else {
    auth.user = undefined;
    auth.uid = null;
    useOtpStore().resetStates();
  }
});

export const useAuthStore = defineStore({
  id: "userAuth",
  state: () => ({
    user: undefined as User | undefined,
    uid: null as string | null,
    phoneNumber: null as string | null,
    authenticating: false,
    fetchingUser: false,
  }),
  getters: {
    isAuthenticated: (state): boolean => {
      return state.user != undefined;
    },
    hasSignedUp: (state): boolean => {
      return (
        state.user?.firstName != undefined &&
        state.user?.firstName.trim().length !== 0 &&
        state.user?.lastName != undefined &&
        state.user?.lastName.trim().length !== 0 &&
        state.user?.email != undefined &&
        state.user?.email.trim().length !== 0
      );
    },
  },
  actions: {
    async getUserData() {
      try {
        this.authenticating = true;
        this.user = await this.createOrGetUser(this.uid!, this.phoneNumber);
      } finally {
        this.authenticating = false;
      }
    },
    async createOrGetUser(
      uId: string,
      phoneNumber: string | null
    ): Promise<User | undefined> {
      try {
        const res = await getDoc(doc(db, "users", uId));
        if (res.exists()) {
          // User already exists, get the existing data
          const existingUserData = res.data() as User;
          return existingUserData;
        } else {
          // User doesn't exist, create a new user with the user's data
          if (!phoneNumber) {
            this.logOut();
            throw Error("Phone No Not Set");
          }
          const newUser: User = {
            id: uId,
            phoneNumber: phoneNumber,
          };
          await setDoc(doc(db, "users", uId), newUser);
          return newUser;
        }
      } catch (error) {
        throw error;
      }
    },
    async updateUserDetails(details: UpdateUserDetails): Promise<void> {
      if (!this.user) {
        throw new Error("User not authenticated");
      }

      const { profilePic, profilePicUrl, ...rest } = details;
      const updatedUser = { ...this.user, ...rest };

      if (profilePic) {
        const storageReference = storageRef(
          storage,
          `avatars/${this.user.id}/${Date.now()}_${profilePic.name}`
        );

        await uploadBytes(storageReference, profilePic)
          .then(async () => {
            const profilePicURL = await getDownloadURL(storageReference);

            await updateDoc(doc(db, "users", this.user!.id), {
              ...updatedUser,
              profilePic: profilePicURL,
            });

            this.user = { ...updatedUser, profilePic: profilePicURL };
          })
          .catch((error) => {
            throw error;
          });
      } else {
        await updateDoc(doc(db, "users", this.user!.id), updatedUser)
          .then(async () => {
            const res = await getDoc(doc(db, "users", this.user!.id));

            if (res) {
              this.user = res.data() as User;
            } else {
              this.user = updatedUser;
            }
          })
          .catch((error) => {
            throw error;
          });
      }
    },
    async logOut() {
      await auth.signOut();
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["uid"] }],
  },
});

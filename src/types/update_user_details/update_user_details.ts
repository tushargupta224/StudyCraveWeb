export default interface UpdateUserDetails {
  firstName: string;

  lastName: string;

  email: string;

  profilePic?: File | null;

  profilePicUrl: string | null;

  interests: string[];
}

export default interface User {
  id: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  phoneNumber: string;

  profilePic?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

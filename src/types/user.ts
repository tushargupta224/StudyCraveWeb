export default interface User {
  id: string;

  firstName: string;

  lastName: string;

  phoneCountryCode: string;

  phoneNumber: string;

  profilePic?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

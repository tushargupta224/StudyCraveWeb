export default interface User {
  id: String;

  firstName: String;

  lastName: String;

  phoneCountryCode: string;

  phoneNumber: string;

  profilePic?: String;

  createdAt?: Date;

  updatedAt?: Date;
}

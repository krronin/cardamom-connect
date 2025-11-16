export interface IUser {
  businessName: string;
  businessAddress: IUserAddress | null;
  gstNumber: string;
  joiningDate: string;
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  phone: string;
  email: string;
  uuid: string;
  businessMarka?: string;
  password?: string;
}

interface IUserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
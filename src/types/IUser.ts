export interface INewUser {
  username: string;
  phone: string;
  email: string;
  register_date: Date | string; // Укажите возможность хранения как строки, так и даты
  code: number;
  city: string;
  [key: string]: string | number | Date;
}

export interface IUser extends INewUser {
  id: number;
}

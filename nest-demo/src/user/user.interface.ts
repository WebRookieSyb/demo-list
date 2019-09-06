export interface UserData {
    username: string;
    email: string;
    token: string;
    image?: string //可选属性
  }
  
  export interface UserRO {
    user: UserData;
  }
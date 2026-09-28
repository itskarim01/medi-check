export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    phoneNo: string;
    password: string;
};

export type toSafeUser = Omit<User, 'password'>;

export function toSafeUser(user: User): toSafeUser {
    const { password, ...toSafeUser } = user;
    return toSafeUser;
}
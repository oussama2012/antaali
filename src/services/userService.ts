import { User } from '../types';

const USERS_STORAGE_KEY = 'antaali_users';

// Initialize with admin user only
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'مدير النظام'
  }
];

export class UserService {
  private static instance: UserService;
  private users: User[] = [];

  private constructor() {
    this.loadUsers();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private loadUsers(): void {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      this.users = [...defaultUsers];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public findUser(username: string, password: string): User | null {
    return this.users.find(u => u.username === username && u.password === password) || null;
  }

  public addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      this.saveUsers();
      return true;
    }
    return false;
  }

  public deleteUser(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.saveUsers();
      return true;
    }
    return false;
  }

  public userExists(username: string): boolean {
    return this.users.some(u => u.username === username);
  }
}

export const userService = UserService.getInstance();

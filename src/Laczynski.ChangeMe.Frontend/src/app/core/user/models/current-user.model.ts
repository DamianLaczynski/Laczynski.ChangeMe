import { User } from './user.model';

/**
 * Model that represents the current user
 */
export interface CurrentUser extends User {}

export const MOCK_USER: CurrentUser = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'John@Doe.com',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
};

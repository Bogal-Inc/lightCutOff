import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { defaultUser, User } from '@Models/user.model';
import { Const } from 'src/environments/const';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(
    protected angularFireAuth: AngularFireAuth,
    protected angularFirestore: AngularFirestore,
  ) {
    super(angularFireAuth, angularFirestore);
  }

  async createUser(user): Promise<void>{
    return this.col(`${Const.collections.users}`).doc(user.id).set({
      ...defaultUser,
      ...user
    });
  }

  updateUser(user: User): Promise<void>{
    return this.update<User>(`${Const.collections.users}/${user.id}`, user);
  }
}

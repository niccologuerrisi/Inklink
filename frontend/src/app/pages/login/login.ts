import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

type Mode = 'register' | 'access';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  mode = signal<Mode>('register');
  submitting = signal(false);
  errorMessage = signal('');

  newUser: Partial<User> = {
    name: '',
    surname: '',
    mail: '',
    password: ''
  };

  accessMail = '';
  accessPassword = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) { }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.errorMessage.set('');
  }

  register(): void {
    this.errorMessage.set('');

    const { name, surname, mail, password } = this.newUser;
    if (!name?.trim() || !surname?.trim() || !mail?.trim() || !password?.trim()) {
      this.errorMessage.set('Compila tutti i campi per creare l\'account.');
      return;
    }

    this.submitting.set(true);

    this.userService.registerUser(this.newUser).subscribe({
      next: () => {
        // l'utente è stato creato, ma non abbiamo ancora un token:
        // facciamo subito un vero login con le stesse credenziali appena scelte
        this.authService.login(mail, password).subscribe({
          next: () => {
            this.submitting.set(false);
            this.router.navigate(['/profile']);
          },
          error: () => {
            this.submitting.set(false);
            this.errorMessage.set('Account creato, ma il login automatico non è riuscito. Prova ad accedere manualmente.');
            this.mode.set('access');
          }
        });
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Registrazione fallita: email già in uso o dati non validi.');
      }
    });
  }

  accessWithPassword(): void {
    this.errorMessage.set('');

    if (!this.accessMail.trim() || !this.accessPassword.trim()) {
      this.errorMessage.set('Inserisci email e password.');
      return;
    }

    this.submitting.set(true);

    this.authService.login(this.accessMail.trim(), this.accessPassword).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Email o password non corrette.');
      }
    });
  }
}

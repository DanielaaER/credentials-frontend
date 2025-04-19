import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      num_control: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { num_control, password } = this.loginForm.value;

    this.authService.login(num_control, password).subscribe({
      next: (response) => {
        this.authService.getUserData().subscribe({
          next: (res) => {
            console.log('User data:', res);
            localStorage.setItem('user_data', JSON.stringify(res));
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
            this.errorMsg = 'Error fetching user data';
          }
        });
      },
      error: () => this.errorMsg = 'Usuario o contraseña incorrectos'
    });


  }
}

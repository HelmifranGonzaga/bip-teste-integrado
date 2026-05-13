import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { User, UserPayload } from '../../../../core/services/user.service';

export interface SaveUserEvent {
  id: number | null;
  payload: Partial<UserPayload>;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    FluidModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TagModule,
    TooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly roles = [
    { label: 'Usuário', value: 'USER' },
    { label: 'Administrador', value: 'ADMIN' }
  ];

  @Input() submitting = false;
  @Input() isAdmin = false;
  @Input() toggling = false;
  @Input() generatingPassword = false;
  private _generatedPassword = '';
  @Input() set generatedPassword(val: string) {
    if (val && val !== this._generatedPassword) {
      this._generatedPassword = val;
      this.form.patchValue({ password: val });
    }
  }
  get generatedPassword(): string {
    return this._generatedPassword;
  }

  @Input() set editingUser(val: User | null) {
    const isSameUser = val && this._editingUser?.id === val.id;
    if (isSameUser) {
      return;
    }
    this._editingUser = val;
    if (val) {
      this.form.patchValue({
        username: val.username,
        nome: val.nome,
        role: val.role,
        password: ''
      });
      this.form.get('username')!.disable();
      this.form.get('password')!.clearValidators();
      this.form.get('password')!.setValidators(Validators.minLength(6));
    } else {
      this.form.reset({ username: '', nome: '', role: 'USER', password: '' });
      this.form.get('username')!.enable();
      this.form.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.form.get('password')!.updateValueAndValidity();
  }
  get editingUser(): User | null {
    return this._editingUser;
  }
  private _editingUser: User | null = null;

  @Output() readonly save = new EventEmitter<SaveUserEvent>();
  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly toggleActive = new EventEmitter<User>();
  @Output() readonly generatePassword = new EventEmitter<void>();

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    role: ['USER' as string, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.submitting) {
      const payload: Partial<UserPayload> = {
        username: this.form.getRawValue().username,
        nome: this.form.value.nome!,
        role: this.form.value.role!
      };
      const pw = this.form.value.password;
      if (pw) {
        payload.password = pw;
      }
      this.save.emit({
        id: this.editingUser?.id ?? null,
        payload
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onToggleActive(): void {
    if (this.editingUser) {
      this.toggleActive.emit(this.editingUser);
    }
  }

  onGeneratePassword(): void {
    this.generatePassword.emit();
  }

  copyPassword(): void {
    const pw = this.form.value.password;
    if (pw) {
      navigator.clipboard.writeText(pw);
    }
  }
}
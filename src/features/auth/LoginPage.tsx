import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { getErrorMessage, getErrorStatus } from '@/utils/getErrorMessage';
import { useLoginMutation } from './authApi';
import { loginSchema, type LoginFormValues, type LoginValidationKey } from './loginSchema';
import { getSafeRedirect } from './redirect';

const DEMO_CREDENTIALS: LoginFormValues = { username: 'emilys', password: 'emilyspass' };

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error, reset: resetLoginError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      navigate(getSafeRedirect(searchParams.get('redirect')), { replace: true });
    } catch {
      // The error is rendered from the mutation state below.
    }
  };

  const fillDemoCredentials = () => {
    resetLoginError();
    setValue('username', DEMO_CREDENTIALS.username, { shouldValidate: true });
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true });
  };

  // DummyJSON answers 400 for a wrong username/password.
  const loginErrorMessage =
    error &&
    (getErrorStatus(error) === 400 ? t('auth.invalidCredentials') : getErrorMessage(error));

  const fieldError = (message?: string) => (message ? t(message as LoginValidationKey) : undefined);

  return (
    <Card sx={{ width: '100%', maxWidth: 420 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} sx={{ alignItems: 'center', mb: 3, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            {t('auth.title')}
          </Typography>
          <Typography color="text.secondary">{t('auth.subtitle')}</Typography>
        </Stack>

        <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit(onSubmit)}>
          {loginErrorMessage && <Alert severity="error">{loginErrorMessage}</Alert>}

          <TextField
            {...register('username')}
            label={t('auth.username')}
            autoComplete="username"
            size="medium"
            error={Boolean(errors.username)}
            helperText={fieldError(errors.username?.message)}
          />

          <TextField
            {...register('password')}
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            size="medium"
            error={Boolean(errors.password)}
            helperText={fieldError(errors.password?.message)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" size="large" loading={isLoading}>
            {t('auth.submit')}
          </Button>

          <Alert severity="info" variant="outlined" role="note">
            <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
              <span>{t('auth.demoHint', DEMO_CREDENTIALS)}</span>
              <Button size="small" onClick={fillDemoCredentials}>
                {t('auth.useDemo')}
              </Button>
            </Stack>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import { styles } from '@/common/styles';
import DialogWindow from '@/components/DialogWindow';
import { useAuth } from '@/providers/AuthProvider';
import { RegistrationRequestData } from '@/types/Auth/request';
import { ScreenProps } from '@/types/props';

const RegistrationScreen = ({ navigation }: ScreenProps) => {
  const { loading, register } = useAuth();

  const validation = {
    username: {
      required: 'This field may not be blank.',
      maxLength: 'No more than 150 characters.',
      pattern: 'Provide the valid username.'
    },
    email: {
      required: 'This field may not be blank.',
      maxLength: 'No more than 150 characters.',
      pattern: 'Provide the valid email.'
    },
    password: {
      required: 'This field may not be blank.',
      minLength: 'At least 8 characters.',
      maxLength: 'No more than 128 characters.',
      pattern: 'Provide the valid password.'
    },
    confirm_password: {
      required: 'This field may not be blank.',
      validate: 'Password mismatch.'
    }
  };

  const [error, setError] = useState<string>('');
  const hideError = () => setError('');
  const { control, handleSubmit, setError: setFieldError, watch } = useForm();
  const handleOnSubmit = async (data: RegistrationRequestData) => {
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    await register!(data, errorHandler);
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((show) => !show);

  return (
    <View style={[styles.container, styles.justifyContentCenter]}>
      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          maxLength: 150,
          pattern: /^[\w]+$/
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Username *"
              mode="outlined"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="account" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.username[
                      fieldError.type as keyof typeof validation.username
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          maxLength: 150,
          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Email *"
              mode="outlined"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="email" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.email[
                      fieldError.type as keyof typeof validation.email
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          minLength: 8,
          maxLength: 128,
          pattern: /^(?=.*\d)(?=.*[A-Za-z]).{8,128}$/
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Password *"
              mode="outlined"
              textContentType="password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="eye" onPress={togglePassword} />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.password[
                      fieldError.type as keyof typeof validation.password
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="confirm_password"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          validate: (password) => password === watch('password')
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Confirm password *"
              mode="outlined"
              textContentType="password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="key" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.confirm_password[
                      fieldError.type as keyof typeof validation.confirm_password
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        style={styles.formButton}
        onPress={handleSubmit((data: object) =>
          handleOnSubmit(data as RegistrationRequestData)
        )}
      >
        Sign Up
      </Button>
      <View style={styles.rowCenter}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <DialogWindow
        title="Attention!"
        type="error"
        message={error}
        button="OK"
        onDismiss={hideError}
        onAgreePress={hideError}
      />
    </View>
  );
};

export default RegistrationScreen;

import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { Button, HelperText, Portal, TextInput } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { styles } from '@/common/styles';
import DialogError from '@/components/DialogError';
import DialogSuccess from '@/components/DialogSuccess';
import { ErrorData } from '@/types/errors';
import { ChangePasswordRequestData } from '@/types/request';

const PrivacySettingsScreen = () => {
  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const validation = {
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

  const [message, setMessage] = useState<string>('');
  const hideMessage = () => setMessage('');
  const [error, setError] = useState<string>('');
  const hideError = () => setError('');
  const { control, handleSubmit, setError: setFieldError, watch } = useForm();
  const handleOnSubmit = async (data: ChangePasswordRequestData) => {
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    try {
      await request({
        url: ENDPOINTS.profile,
        method: 'PATCH',
        data
      });
      setMessage('Password has been changed successfully!');
    } catch (err) {
      const error = (err as AxiosError).response?.data as ErrorData;
      handleErrors(error.details, errorHandler);
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((show) => !show);

  return (
    <View style={[styles.container, styles.centerVertical]}>
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: true
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <>
            <TextInput
              label="Old password *"
              mode="outlined"
              secureTextEntry={!showPassword}
              textContentType="password"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="shield-key" />}
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
          </>
        )}
      />
      <Controller
        name="new_password"
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
          <>
            <TextInput
              label="New password *"
              mode="outlined"
              secureTextEntry={!showPassword}
              textContentType="password"
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
          </>
        )}
      />
      <Controller
        name="confirm_password"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          validate: (password) => password === watch('new_password')
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <>
            <TextInput
              label="Confirm new password *"
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
          </>
        )}
      />
      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        style={styles.formButton}
        onPress={handleSubmit((data: object) =>
          handleOnSubmit(data as ChangePasswordRequestData)
        )}
      >
        Change
      </Button>
      <Portal>
        <DialogSuccess
          title="Congratulations!"
          message={message}
          button="OK"
          onDismiss={hideMessage}
          onAgreePress={hideMessage}
        />
        <DialogError
          title="Attention!"
          error={error}
          button="OK"
          onDismiss={hideError}
          onAgreePress={hideError}
        />
      </Portal>
    </View>
  );
};

export default PrivacySettingsScreen;

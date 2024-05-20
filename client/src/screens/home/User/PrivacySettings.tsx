import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { styles } from '@/common/styles';
import DialogWindow from '@/components/DialogWindow';
import { ChangePasswordRequestData } from '@/types/User/request';
import { ErrorData } from '@/types/errors';

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
  const {
    control,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    watch
  } = useForm();
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
    <View style={[styles.container, styles.justifyContentCenter]}>
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
          <View>
            <TextInput
              label="Old password *"
              mode="outlined"
              secureTextEntry={!showPassword}
              textContentType="password"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
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
          </View>
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
          <View>
            <TextInput
              label="New password *"
              mode="outlined"
              secureTextEntry={!showPassword}
              textContentType="password"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
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
          validate: (password) => password === watch('new_password')
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Confirm new password *"
              mode="outlined"
              textContentType="password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
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
          handleOnSubmit(data as ChangePasswordRequestData)
        )}
      >
        Change
      </Button>
      <DialogWindow
        title="Congratulations!"
        type="success"
        message={message}
        button="OK"
        onDismiss={hideMessage}
        onAgreePress={hideMessage}
      />
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

export default PrivacySettingsScreen;

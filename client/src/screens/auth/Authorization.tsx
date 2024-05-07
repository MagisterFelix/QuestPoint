import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput
} from 'react-native-paper';

import { styles } from '@/common/styles';
import { useAuth } from '@/providers/AuthProvider';
import { AuthorizationRequestData } from '@/types/request';
import { ScreenProps } from '@/types/screen';

const AuthorizationScreen = ({ navigation }: ScreenProps) => {
  const { loading, login } = useAuth();

  const validation = {
    username: {
      required: 'This field may not be blank.'
    },
    password: {
      required: 'This field may not be blank.'
    }
  };

  const [error, setError] = useState('');
  const hideError = () => setError('');
  const { control, handleSubmit, setError: setFieldError } = useForm();
  const handleOnSubmit = async (data: AuthorizationRequestData) => {
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    await login!(data, errorHandler);
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((show) => !show);

  return (
    <View style={[styles.container, styles.centerVertical]}>
      <Controller
        name="username"
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
              label="Username or email *"
              mode="outlined"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              right={<TextInput.Icon icon="account" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.noGap}>
                {fieldError
                  ? fieldError.message ||
                    validation.username[
                      fieldError.type as keyof typeof validation.username
                    ]
                  : ''}
              </HelperText>
            )}
          </>
        )}
      />
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
              label="Password *"
              mode="outlined"
              secureTextEntry={!showPassword}
              textContentType="password"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              right={<TextInput.Icon icon="eye" onPress={togglePassword} />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.noGap}>
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
      <Button
        mode="contained"
        loading={loading}
        style={styles.formButton}
        onPress={handleSubmit((data: object) =>
          handleOnSubmit(data as AuthorizationRequestData)
        )}
      >
        Sign In
      </Button>
      <View style={styles.row}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog visible={error !== ''} onDismiss={hideError}>
          <Dialog.Content>
            <Text>{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideError}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default AuthorizationScreen;

import { AxiosError, AxiosResponse } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import {
  Avatar,
  Button,
  HelperText,
  TextInput,
  TouchableRipple
} from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { styles } from '@/common/styles';
import DialogWindow from '@/components/DialogWindow';
import { useAuth } from '@/providers/AuthProvider';
import { usePayment } from '@/providers/PaymentProvider';
import { UpdateAccountRequestData } from '@/types/User/request';
import { ProfileResponseData } from '@/types/User/response';
import { ErrorData } from '@/types/errors';

const AccountSettingsScreen = () => {
  const { user, updateUser } = useAuth();

  const { updateCustomer } = usePayment();

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const validation = {
    image: {
      validate: 'Invalid image or size greater than 10 MB.'
    },
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
    first_name: {
      maxLength: 'No more than 150 characters.'
    },
    last_name: {
      maxLength: 'No more than 150 characters.'
    }
  };

  const [message, setMessage] = useState<string>('');
  const hideMessage = () => setMessage('');
  const [info, setInfo] = useState<string>('');
  const hideInfo = () => setInfo('');
  const [error, setError] = useState<string>('');
  const hideError = () => setError('');
  const {
    control,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    reset
  } = useForm();
  const handleOnSubmit = async (data: UpdateAccountRequestData) => {
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    const filtered = Object.entries(data).filter(
      (entry: [string, any]) =>
        user && user[entry[0] as keyof ProfileResponseData] !== entry[1]
    );
    if (filtered.length === 0) {
      setInfo('Nothing to update!');
    } else {
      const formData = new FormData();
      filtered.forEach((entry: [string, any]) =>
        formData.append(entry[0], entry[1])
      );
      try {
        const response: AxiosResponse<ProfileResponseData> = await request({
          url: ENDPOINTS.profile,
          method: 'PATCH',
          data: formData
        });
        updateUser!(response.data);
        reset(response.data);
        if (data.username || data.email) {
          updateCustomer!(data);
        }
        setMessage('Account has been updated successfully!');
      } catch (err) {
        const error = (err as AxiosError).response?.data as ErrorData;
        handleErrors(error.details, errorHandler);
      }
    }
  };

  const [showImage, setShowImage] = useState<boolean>(true);
  const pickImage = async (onChange: (...event: any[]) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75
    });
    if (!result.canceled) {
      const image = result.assets[0];
      const uri = image.uri;
      const name = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
      const type = image.mimeType;
      const file = {
        uri,
        type,
        name
      };
      onChange(file);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setShowImage(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setShowImage(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [clearErrors]);

  return (
    <View style={[styles.container, styles.justifyContentCenter]}>
      {showImage && (
        <View style={[styles.alignItemsCenter, styles.formField]}>
          <Controller
            name="image"
            control={control}
            defaultValue={user?.image}
            render={({ field: { onChange, value } }) => (
              <TouchableRipple
                onPress={() => pickImage(onChange)}
                borderless
                style={[styles.formField, styles.imageRipple]}
              >
                <Avatar.Image
                  source={{
                    uri: value?.uri ? value.uri : user?.image
                  }}
                  size={128}
                  style={styles.image}
                />
              </TouchableRipple>
            )}
          />
        </View>
      )}
      <Controller
        name="username"
        control={control}
        defaultValue={user?.username}
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
              onFocus={() => clearErrors()}
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
        defaultValue={user?.email}
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
              onFocus={() => clearErrors()}
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
        name="first_name"
        control={control}
        defaultValue={user?.first_name}
        rules={{
          maxLength: 150
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="First name"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="card-account-details" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.first_name[
                      fieldError.type as keyof typeof validation.first_name
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="last_name"
        control={control}
        defaultValue={user?.last_name}
        rules={{
          maxLength: 150
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Last name"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="card-account-details" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.last_name[
                      fieldError.type as keyof typeof validation.last_name
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
          handleOnSubmit(data as UpdateAccountRequestData)
        )}
      >
        Update
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
      <DialogWindow
        title="Oops..."
        type="info"
        message={info}
        button="OK"
        onDismiss={hideInfo}
        onAgreePress={hideInfo}
      />
    </View>
  );
};

export default AccountSettingsScreen;

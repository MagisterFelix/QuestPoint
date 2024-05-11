import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import {
  Button,
  HelperText,
  Portal,
  Switch,
  Text,
  TextInput
} from 'react-native-paper';

import { styles } from '@/common/styles';
import Coins from '@/components/Coins';
import DialogError from '@/components/DialogError';
import { useAuth } from '@/providers/AuthProvider';
import { usePayment } from '@/providers/PaymentProvider';
import { TransactionRequestData } from '@/types/request';

const PaymentScreen = () => {
  const { user, stripeAccount } = useAuth();

  const { loading, error, hideError, pay, payout } = usePayment();

  const [isPayout, setIsPayout] = useState<boolean>(false);
  const onSwitch = () => setIsPayout(!isPayout);

  const validation = {
    account: {
      required: 'This field may not be blank.'
    },
    amount: {
      required: 'This field may not be blank.',
      min: isPayout ? 'At least 100 coins' : 'At least 1$.',
      max: isPayout
        ? `No more than current balance for payout.`
        : 'No more than 100$ for payment.',
      pattern: 'Provide a valid amount.'
    }
  };

  const { control, handleSubmit } = useForm();
  const handleOnSubmit = async (data: TransactionRequestData) => {
    Keyboard.dismiss();
    if (isPayout) {
      await payout!(data);
    } else {
      await pay!(data);
    }
  };

  return (
    <View style={[styles.container, styles.centerVertical]}>
      <View style={styles.rowSpaceBetween}>
        <View style={styles.rowCenter}>
          <Text style={styles.headerTitle}>Balance:</Text>
          <Coins amount={user?.balance!} size={32} />
        </View>
        <Switch value={isPayout} onValueChange={onSwitch} />
      </View>
      {isPayout && (
        <Controller
          name="account"
          control={control}
          defaultValue={stripeAccount}
          rules={{
            required: true
          }}
          render={({
            field: { onChange, value },
            fieldState: { error: fieldError }
          }) => (
            <>
              <TextInput
                label="Stripe account *"
                mode="outlined"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={fieldError !== undefined}
                style={styles.formField}
                right={<TextInput.Icon icon="account-tie" />}
              />
              {fieldError !== undefined && (
                <HelperText type="error" style={styles.formHelperText}>
                  {fieldError
                    ? fieldError.message ||
                      validation.account[
                        fieldError.type as keyof typeof validation.account
                      ]
                    : ''}
                </HelperText>
              )}
            </>
          )}
        />
      )}
      <Controller
        name="amount"
        control={control}
        defaultValue=""
        rules={{
          required: true,
          min: isPayout ? 100 : 1,
          max: isPayout ? user?.balance : 100,
          pattern: /\d+/
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <>
            <TextInput
              label="Amount *"
              mode="outlined"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="currency-usd" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.amount[
                      fieldError.type as keyof typeof validation.amount
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
          handleOnSubmit(data as TransactionRequestData)
        )}
      >
        {isPayout ? 'Pay Out' : 'Pay'}
      </Button>
      <Portal>
        <DialogError
          title="Oops..."
          error={error ? 'Something went wrong...' : ''}
          button="OK"
          onDismiss={hideError!}
          onAgreePress={hideError!}
        />
      </Portal>
    </View>
  );
};

export default PaymentScreen;

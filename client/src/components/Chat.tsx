import { AxiosResponse } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, ScrollView } from 'react-native';
import { ActivityIndicator, Card, TextInput } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import Message from '@/components/Message';
import { useAuth } from '@/providers/AuthProvider';
import { ChatProps } from '@/types/props';
import { MessageRequestData } from '@/types/request';
import { MessageContentType, MessageResponseData } from '@/types/response';

const Chat = ({ record, isKeyboardVisible }: ChatProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const { user } = useAuth();

  const [messages, setMessages] = useState<MessageResponseData[]>([]);

  const [{ loading: loadingMessages, data: messageList }] = useAxios<
    MessageResponseData[]
  >({
    url: `${ENDPOINTS.messages}${record.quest.id}`,
    method: 'GET'
  });

  const [choose, setChoose] = useState<MessageContentType | null>(null);

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const { control, handleSubmit, reset } = useForm();
  const handleOnSubmit = async (data: MessageRequestData) => {
    if (!data.content) {
      return;
    }
    Keyboard.dismiss();
    setChoose(data.content_type);
    const response: AxiosResponse<MessageResponseData> = await request({
      url: `${ENDPOINTS.messages}${record.quest.id}/`,
      method: 'POST',
      data
    });
    reset({ content: '' });
    setMessages((prev: MessageResponseData[]) => [...prev, response.data]);
    setChoose(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    });
    if (!result.canceled) {
      const image = result.assets[0];
      const type = image.mimeType;
      const base64 = image.base64;
      const data = {
        content: `data:${type};base64,${base64}`,
        content_type: MessageContentType.Image
      };
      handleOnSubmit(data);
    }
  };

  const sendMessage = async (content: string) => {
    const data = {
      content,
      content_type: MessageContentType.Text
    };
    handleOnSubmit(data);
  };

  useEffect(() => {
    if (!messageList) {
      return;
    }
    setMessages(messageList);
  }, [messageList]);

  if (loadingMessages) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <Card style={[styles.quest, { height: isKeyboardVisible ? '95%' : '60%' }]}>
      <ScrollView
        ref={scrollViewRef}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: false })
        }
        style={{
          height: '100%'
        }}
      >
        {messages?.map((message: MessageResponseData) => (
          <Message
            key={message.id}
            message={message}
            isOwner={message.author.id === user?.id}
          />
        ))}
      </ScrollView>
      <Controller
        name="content"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Send message..."
            value={typeof value === 'string' ? value : ''}
            onChangeText={onChange}
            style={[
              styles.formField,
              {
                backgroundColor: theme.colors.elevation.level1,
                marginVertical: 0
              }
            ]}
            left={
              <TextInput.Icon
                icon="image"
                forceTextInputFocus={false}
                loading={choose === MessageContentType.Image && loading}
                disabled={loading}
                onPress={pickImage}
              />
            }
            right={
              <TextInput.Icon
                icon="send"
                forceTextInputFocus={false}
                loading={choose === MessageContentType.Text && loading}
                disabled={loading}
                onPress={handleSubmit((data: object) =>
                  sendMessage((data as MessageRequestData).content)
                )}
              />
            }
          />
        )}
      />
    </Card>
  );
};

export default Chat;

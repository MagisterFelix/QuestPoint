import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { CategoryData } from '@/types/Map/CategoryData';
import { CategoriesResponseData } from '@/types/response';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Button,
  HelperText,
  Icon,
  Provider as PaperProvider,
  TextInput
} from 'react-native-paper';
const QuestCreate = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [{ loading }, request] = useAxios(
    {
      timeout: 10000
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response: AxiosResponse<CategoriesResponseData> = await request({
          url: ENDPOINTS.categories,
          method: 'GET'
        });

        setCategories(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.code === AxiosError.ERR_NETWORK) {
          alert('Timeout!');
          return;
        }
      }
    };

    getCategories();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);
  const [reward, setReward] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const adjustments = [-20, -5, -1, 1, 5, 20];
  const increaseReward = (value: number) => {
    setReward((prevReward) => Math.max(0, prevReward + value));
  };
  const validateText = (text: String) => {
    return text.length >= 5;
  };

  return (
    <PaperProvider>
      <View style={styles.center}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon source={'plus-circle'} size={42} color={'white'} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon source={'close-circle'} size={42} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.textLabel}>Create quest</Text>
          <View>
            <TextInput
              style={styles.inputTitle}
              label="Title"
              mode="outlined"
              value={title}
              onChangeText={(title) => setTitle(title)}
              right={<TextInput.Icon icon="pencil" />}
              placeholder="I need help with the garden..."
              maxLength={40}
            />
            <HelperText type="error" visible={!validateText(title)}>
              Title must contain at least 5 letters.
            </HelperText>
            <TextInput
              style={styles.inputDescription}
              label="Description"
              mode="outlined"
              multiline={true}
              value={description}
              onChangeText={(description) => setDescription(description)}
              right={<TextInput.Icon icon="note-edit-outline" />}
              placeholder="You need to cut down 5 trees and..."
              maxLength={200}
              numberOfLines={4}
            />
            <HelperText type="error" visible={!validateText(description)}>
              Description must contain at least 5 letters.
            </HelperText>
          </View>

          <Text style={styles.textLabel}>Reward</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={styles.rewardText}>{reward} QP</Text>
            {reward > 0 && (
              <TouchableOpacity onPress={() => setReward(0)}>
                <Icon source={'eraser'} size={24} color={'black'} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.rewardContainer}>
            {adjustments.map((adjustment) => (
              <Button
                key={adjustment}
                mode="outlined"
                onPress={() => increaseReward(adjustment)}
                style={styles.button}
                compact={true}
              >
                {adjustment >= 0 ? `+${adjustment}` : adjustment}
              </Button>
            ))}
          </View>
          <Text style={styles.textLabel}>Category</Text>

          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              style={styles.categoryScrollView}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category
                      ? styles.selectedCategory
                      : null
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryText}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.finishContainer}>
            <TouchableOpacity>
              <Icon source={'plus-circle'} size={56} color={'grey'} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10
  },
  modalView: {
    flex: 1,
    justifyContent: 'space-between'
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center'
  },
  categoryScrollView: {
    flexDirection: 'row',
    marginTop: 20
  },
  categoryItem: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 20
  },
  selectedCategory: {
    backgroundColor: 'grey'
  },
  categoryText: {
    color: 'white'
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  inputTitle: {
    margin: 20
  },
  inputDescription: {
    margin: 20
  },
  textLabel: {
    fontSize: 30,
    textAlign: 'center'
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  rewardText: {
    fontSize: 36,
    marginHorizontal: 10,
    textAlign: 'center'
  },
  button: {
    margin: 5
  },
  finishContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto'
  }
});

export default QuestCreate;

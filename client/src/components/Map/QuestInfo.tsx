import React, { useState } from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { Button, Card, Icon, IconButton, Text } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles } from '@/common/styles';
import { getDistance } from '@/common/utils';
import Coins from '@/components/Coins';
import { useLocation } from '@/providers/LocationProvider';
import { useQuestData } from '@/providers/QuestDataProvider';
import { QuestInfoProps } from '@/types/Map/props';
import { CreateRecordRequestData } from '@/types/Map/request';

const QuestInfo = ({ height, show, quest, toggle, onSend }: QuestInfoProps) => {
  const { location } = useLocation();

  const { updateQuests } = useQuestData();

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const [processing, setProcessing] = useState<boolean>(false);

  const sendOffer = async (data: CreateRecordRequestData) => {
    setProcessing(true);
    await request({
      url: ENDPOINTS.records,
      method: 'POST',
      data
    });
    await updateQuests!();
    onSend();
    setProcessing(false);
  };

  return (
    <View style={styles.questInfo}>
      <IconButton
        style={styles.chevron}
        icon={show ? 'chevron-double-down' : 'chevron-double-up'}
        size={24}
        onPress={toggle}
      />
      <Animated.View style={[styles.questInfoContent, { height }]}>
        {show && (
          <View style={styles.containerInner}>
            <Card style={styles.fullWidthCard}>
              <ScrollView>
                <Card.Content style={styles.cardContentMain}>
                  <Text
                    variant="bodyLarge"
                    style={[styles.boldTitle, styles.textCenter]}
                  >
                    {quest.title}
                  </Text>
                </Card.Content>
                <Card.Content>
                  <View style={styles.flexForWrap}>
                    <Text
                      variant="bodyLarge"
                      style={[styles.wrap, styles.textJustify]}
                    >
                      {quest.description}
                    </Text>
                  </View>
                </Card.Content>
              </ScrollView>
            </Card>
            <View style={styles.row}>
              <Card style={[styles.card, styles.smallCard]}>
                <Card.Content style={styles.cardContentAdditional}>
                  <View style={styles.iconWithText}>
                    <Icon source="account" size={16} />
                    <Text variant="bodySmall" style={styles.boldTitle}>
                      {' '}
                      Creator
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.textCenter}>
                    {quest.creator.username}
                  </Text>
                </Card.Content>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="treasure-chest" size={16} />
                    <Text variant="bodySmall" style={styles.boldTitle}>
                      {' '}
                      Reward
                    </Text>
                  </View>
                  <Coins amount={quest.reward} size={20} />
                </Card.Content>
              </Card>
              <Card style={[styles.card, styles.smallCard]}>
                <Card.Content style={styles.cardContentAdditional}>
                  <View style={styles.iconWithText}>
                    <Icon source="calendar" size={16} />
                    <Text variant="bodySmall" style={styles.boldTitle}>
                      {' '}
                      Date
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.textCenter}>
                    {new Date(quest.created_at).toLocaleDateString()}
                  </Text>
                </Card.Content>
                <Card.Content>
                  <View style={styles.iconWithText}>
                    <Icon source="walk" size={16} />
                    <Text variant="bodySmall" style={styles.boldTitle}>
                      {' '}
                      Distance
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.textCenter}>
                    {`${getDistance(location!.latitude, location!.longitude, quest.latitude, quest.longitude).toFixed(2)} steps`}
                  </Text>
                </Card.Content>
              </Card>
            </View>
            <Card.Actions>
              {quest.status === 'Available' && (
                <Button
                  mode="contained"
                  loading={loading}
                  disabled={processing || loading}
                  style={styles.formButton}
                  onPress={() => {
                    const data = { quest: quest.id };
                    sendOffer(data as CreateRecordRequestData);
                  }}
                >
                  Send Offer
                </Button>
              )}
            </Card.Actions>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default QuestInfo;

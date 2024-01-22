import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { groupsGetAll } from '@storage/group/groupsGetAll';

import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Container } from './styles';

export function Groups() {
  const [isLoading, setIsloading] = useState(true)

  const [groups, setGroups] = useState<string[]>([])

  const navigation = useNavigation()

  async function fetchGroups() {
    try {
      setIsloading(true)

      const data = await groupsGetAll()
      setGroups(data)
    } catch (error) {
      console.log(error);
      Alert.alert('Turmas', 'Não foi possível carregar as turmas')
    } finally {
      setIsloading(false)
    }
  }

  function handleNewGroup() {
    navigation.navigate('new')
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(useCallback(() => {
    fetchGroups()
  }, []))

  return (
    <Container>
      <Header />

      <Highlight
        title="Turmas"
        subtitle="Jogue com a sua turma"
      />

      {
        isLoading? <Loading/> :

        <FlatList 
          data={groups}
          keyExtractor={item => item}
          contentContainerStyle={groups.length === 0 && { flex: 1} }
          renderItem={({ item }) => (
            <GroupCard 
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar a primeira turma?"/>
          )}
          showsVerticalScrollIndicator={false}
        />
      }


      <Button 
        title='Criar nova turma'
        onPress={handleNewGroup}
      />

    </Container>
  );
}

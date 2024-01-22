import { useRoute, useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";

import { Container, Form, HeaderList, QuantityOfPlayers } from "./styles";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import { AppError } from "@utils/AppError";

import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
    group: string
}

export function Players() {
    const [isLoading, setIsloading] = useState(true)
    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [newPlayerName, setNewPlayerName] = useState('')

    const newPlayerNameInputRef = useRef<TextInput>(null)

    const navigation = useNavigation()

    const route = useRoute()
    const { group } = route.params as RouteParams

    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group)

            newPlayerNameInputRef.current?.blur()
            

            setNewPlayerName('')
            fetchPlayersByTeam()
            
        } catch (error) {
            if(error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                Alert.alert('Nova pessoa', 'Não foi possível adicionar')
                console.log(error);
            }
        }

    }

    async function fetchPlayersByTeam() {
        try {
            setIsloading(true)

            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch(error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado')
        } finally {
            setIsloading(false)
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayersByTeam()
        } catch(error) {
            console.log(error);
            Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group)
            navigation.navigate('groups')
        } catch (error) {
            console.log(error);
            Alert.alert('Remover turma', 'Não foi possível remover a turma')
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover', 
            'Deseja remover a turma?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove}
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [team])

    return (
        <Container>
            <Header showBackButton />

            <Highlight 
                title={group}
                subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon
                    onPress={handleAddPlayer}
                    icon="add"
                />
            </Form>

            <HeaderList>
                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <QuantityOfPlayers>
                    {players.length}
                </QuantityOfPlayers>

            </HeaderList>

            {
                isLoading ? <Loading/> :

                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard 
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty message="Não há pessoas nesse time"/>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1}
                    ]}
                />
            }


            <Button
                title="Remover turma"
                type="SECONDARY"
                onPress={handleGroupRemove}
            />

        </Container>
    )
}
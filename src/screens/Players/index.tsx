import { Header } from "@components/Header";
import { ButtonIcon } from "@components/ButtonIcon";
import { Container } from "./styles";
import { Highlight } from "@components/Highlight";


export function Players() {
    return (
        <Container>
            <Header showBackButton />

            <Highlight 
                title="Nome da turma"
                subtitle="adicione a galera e separe os times"
            />

            

            <ButtonIcon />
        </Container>
    )
}
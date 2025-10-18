import styles from "./page.module.css";
import { Container } from "@mantine/core";
import MainPanel from "./containers/MainPanel";

export default function Home() {
  return (
        <Container p={'sm'} fluid>
            <MainPanel />
        </Container>
  );
}

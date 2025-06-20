import { Container } from "../../components/Container";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import LoggedInUser from "./LoggedInUser";
import { GuestUser } from "./GuestUser";
import Menu from "../../components/Menu";
import MenuLogged from "../../components/MenuLogged";
import { ProfilePage } from "../ProfilePage";

const HomePage = () => {
  const { user } = useFirebaseUser();
  return (
    <>
      {user ? <MenuLogged /> : <Menu />}
      <Container>{user ? <LoggedInUser /> : <GuestUser />}</Container>
    </>
  );
};

export default HomePage;

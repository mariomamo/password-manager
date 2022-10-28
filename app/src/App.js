import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/AccountList/accountlist';
import AddBar from './components/AddBar/addbar';
import './services/fileservice.js';
import { getPasswords } from './services/fileservice.js';

function App() {
  const accountList = getPasswords();

  return (
    <div>
      <div className="App">
        <AddBar />
        <AccountList accountList={accountList}/>
      </div>
    </div>
  );
}

export default App;

import './App.css';
import 'antd/dist/antd.css';
import AccountList from './components/accountlist/accountlist';
import AddBar from './components/addbar/addbar';
import './functions/filereader.js';
import { getPasswords } from './functions/filereader.js';

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

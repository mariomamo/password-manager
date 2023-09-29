import { useEffect, useState } from "react";
import { storageService } from "../../services/StorageService/StorageServiceConfig";

const useSettingsPageHook = ()=> {
    const [server, setServer] = useState("");
    const [PublicKey, setPublicKey] = useState("");
    const [PrivateKey, setPrivateKey] = useState("");

    useEffect(() => {        
        (async function f() {
            setServer(await storageService.get("server"));
            setPublicKey(await storageService.get("PublicKey"));
            setPrivateKey(await storageService.get("PrivateKey"));
        })();
    }, [])

    const saveSettings = ()=> {
        storageService.set("server", server);
        storageService.set("PublicKey", PublicKey);
        storageService.set("PrivateKey", PrivateKey);
    }

    return {server, PublicKey, PrivateKey, setServer, setPublicKey, setPrivateKey, saveSettings};
}

export default useSettingsPageHook;
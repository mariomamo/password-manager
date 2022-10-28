export const getPasswords = ()=> {
    // var AllFiles = window.Neutralino.filesystem.readDirectory('./app/src/services');
    return ["Facebook", "Instagram", "Mail", "Wolterskluwer domain"];
}

export const readFile = async ()=> {
    var data = await window.Neutralino.filesystem.readFile('./app/src/services/conf.yml');
    console.log(data);
}

export const copyToClipboard = async (value) => {
    return await window.Neutralino.clipboard.writeText(value);
}

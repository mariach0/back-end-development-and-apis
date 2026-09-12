import {readFile , writeFile} from "fs/promises"
import path from "path"

const accPath = path.join(import.meta.dirname , "accounts.json")

export async function getAccounts() {
    const accounts = await readFile(accPath , "utf-8" , (err)=> {
        if (err) {
            throw err
        }
    })
    return accounts
}


export async function saveAccounts(accounts) {
    writeFile(accPath , accounts , "utf-8" , (err)=> {
        if (err) {
            throw err
        }
    })
    console.log("Accounts saved");
    
    
}
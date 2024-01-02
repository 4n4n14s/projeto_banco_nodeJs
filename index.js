//modulos externos

const chalk = require('chalk')
const inquirer = require('inquirer')

//modulos internos

const fs = require('fs')

operation()
//lista de operaçoes
function operation(){
    inquirer.prompt([
        {

            type: 'list',
            name: 'action',
            message: 'o que deseja fazer? ',
            choices: ['criar conta', 'consultar saldo', 'depositar', 'sacar', 'sair']
        },
]).then((answer)=>{
    const action = answer['action']

    if (action === 'criar conta') {
        createAccount()
        buildAccount()
        
    }else if (action === 'consultar saldo') {
        getAccountBalance()
    }else if (action === 'depositar') {
        deposit()
    }else if (action === 'sacar') {
        withdraw()
    }else if (action === 'sair') {
        console.log(chalk.bgBlue.black('obrigado por usar o accounts!'))
        process.exit()
        
    }


}).catch(err => console.log(err))

}
//mensagem de parabens 
function createAccount(){
    console.log(chalk.bgGreen.black('parabens por ter escolhido nosso banco'))
    console.log(chalk.green('defina as opçoes da sua conta a seguir'))
}
// criando a conta
function buildAccount (){

    inquirer.prompt([
        {
            name: 'accountName',
            message:'digite um nome para sua conta: '
        }

    ]).then((answer)=>{
        const accountName = answer['accountName']

        console.log(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('esta conta ja existe, escolha outro nome!'))


            buildAccount ()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', (err)=>{console.log(err)})

        console.log(chalk.green('parabens, sua conta foi criada'))
        operation()




    }).catch(err=>console.log(err))

}
//deposito dinheiro
function deposit() {

    inquirer.prompt([
        {
            name:'accountName',
            message:'qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']
        if (!checkAccounts(accountName)) {
            return deposit()
            
        }

        inquirer.prompt([
            {
                name:'amount',
                message: 'quanto voce deseja depositar!'
            }
        ]).then((answer=>{

            const amount = answer['amount']
            addAmount(accountName, amount)
            operation()





        })).catch(err => console.log(err))

        
    }).catch(err=>console.log(err))


    
}
//verifico se a conta existe 
function checkAccounts(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('digite uma conta existente'))
        return false
        
    }
    return true


    
}
// adicionar dinheiro
function addAmount(accountName,amount) {
    const accountData = getAccount(accountName) 

    
    if (!amount) {
        console.log(chalk.bgRed.black('ocorreu um erro, tente novamente mais tarde'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green(`foi depositado o valor de R$${amount} na sua conta`))
    
    
}
// seleciono a conta em json
function getAccount(accountName) {
    const acconuntJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8', 
        flag: 'r'
    })

    return JSON.parse(acconuntJson)
}
//mostra o valor da conta
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']

        if (!checkAccounts(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`o saldo da sua conta é de R$${accountData.balance}`))

        operation()



    }).catch(err=>console.log(err))
}
//validação para sacar dinheiro
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']

        if (!checkAccounts(accountName)) {
            return withdraw()
            
        }
        inquirer.prompt([
            {
                name:'amount',
                message:'quanto vc deseja sacar?'
            }
        ]).then((answer)=>{

            const amount = answer['amount']
            removeAmaunt(accountName, amount)
            





        }).catch(err=>console.log(err))

        


    }).catch(err=>console.log(err))
}

function removeAmaunt(accountName, amount) {
    const accountData = getAccount(accountName)
    if (!amount) {
        console.log(chalk.bgRed.black('ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('valor indisponivel'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err){console.log(err)}
    )
    console.log(chalk.green(`foi realizado um saque de R$${amount} na sua conta`))
    operation()


}
class User {
    constructor() {
        this.accessToken = ""
        this.refreshToken = ""
        this.name = ""
        this.surname = ""
        this.birthday = ""
        this.email = ""
        this.username = ""
        this.password = ""
        this.codice_invito = ""
        this.avatar = null
        this.xp = ""
        this.language = ""
        this.league = ""
        this.consecutiveDaysJoin = ""
        this.role = []
        this.createdCodes = []
        // language, league, consecutiveDaysJoin, role
    }

    load({ accessToken, refreshToken, name, surname, birthday, email, username, password, codice_invito, avatar, xp, language, league, consecutiveDaysJoin, role, createdCodes }) {
        this.accessToken = accessToken != undefined ? accessToken : this.accessToken
        this.refreshToken = refreshToken != undefined ? refreshToken : this.refreshToken
        this.name = name != undefined ? name : this.name
        this.surname = surname != undefined ? surname : this.surname
        this.birthday = birthday != undefined ? birthday : this.birthday
        this.email = email != undefined ? email : this.email
        this.username = username != undefined ? username : this.username
        this.password = password != undefined ? password : this.password
        this.codice_invito = codice_invito != undefined ? codice_invito : this.codice_invito
        this.avatar = avatar != undefined ? avatar : this.avatar
        this.xp = xp != undefined ? xp : this.xp
        this.language = language != undefined ? language : this.language
        this.league = league != undefined ? league : this.league
        this.consecutiveDaysJoin = consecutiveDaysJoin != undefined ? consecutiveDaysJoin : this.consecutiveDaysJoin
        this.role = role != undefined ? role : this.role
        this.createdCodes = createdCodes != undefined ? createdCodes : this.createdCodes
    }

    setAccessToken(accessToken) {this.accessToken = accessToken}
    setRefreshToken(refreshToken) {this.refreshToken = refreshToken}
    setName(name) {this.name = name}
    setSurname(surname) {this.surname = surname}
    setBirthday(birthday) {this.birthday = birthday}
    setEmail(email) {this.email = email}
    setUsername(username) {this.username = username}
    setPassword(password) {this.password = password}
    setCodiceInvito(codice_invito) {this.codice_invito = codice_invito}
    setAvatar(avatar) {this.avatar = avatar}
    setXP(xp) {this.xp = xp}
    setLanguage(language) {this.language = language}
    setLeague(league) {this.league = league}
    setConsecutiveDaysJoin(consecutiveDaysJoin) {this.consecutiveDaysJoin = consecutiveDaysJoin}
    setRole(role) {this.role = role}
    setCreatedCodes(createdCodes) { this.createdCodes = createdCodes}

    getAccessToken() {return this.accessToken}
    getRefreshToken() {return this.refreshToken}
    getName() {return this.name}
    getSurname() {return this.surname}
    getBirthday() {return this.birthday}
    getEmail() {return this.email}
    getUsername() {return this.username}
    getPassword() {return this.password}
    getCodiceInvito() {return this.codice_invito}
    getAvatar() {return this.avatar}
    getXP() {return this.xp}
    getLanguage() {return this.language}
    getLeague() {return this.league}
    getConsecutiveDaysJoin() {return this.consecutiveDaysJoin}
    getRole() {return this.role}
    getCreatedCodes() {return this.createdCodes}
}

export default User
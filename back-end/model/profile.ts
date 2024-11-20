class Profile {
    private email: string;
    public name: string;
    public lastName: string;
    public userId: number;

    constructor (profile: {email: string, name: string, lastName: string; userId: number}) {
        this.validateprofiles(profile);

        this.email = profile.email;
        this.name = profile.name;
        this.lastName = profile.lastName;
        this.userId = profile.userId;
    }

    private validateprofiles = (profile: {email: string, name: string, lastName: string}) => {
        if (typeof profile.email !== 'string' || profile.email.length > 60 || !this.validateEmail(profile.email)) {
            throw new Error('Invalid email value');
        }

        if (typeof profile.name !== 'string' || profile.name.length > 40) {
            throw new Error('Invalid name value');
        }

        if (typeof profile.lastName !== 'string' || profile.lastName.length > 60) {
            
            throw new Error('Invalid lastname value');
    
        }

    };

    getFullName = ():string => {
        return `${this.name} ${this.lastName}`;
    };
    
    getAbbreviatedName= ():string => {
        return `${this.name[0]}${this.lastName[0]}`;
    }

    setName= (name : string) =>
    {
        this.name = name;
    }

    setLastName= (lastName: string) => {
        this.lastName = lastName;
    }

    validateEmail= (email:string): boolean =>
    {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    getEmail= ():string =>
    {
        return this.email;
    }
}
export default Profile;
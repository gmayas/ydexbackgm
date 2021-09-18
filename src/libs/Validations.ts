import bcrypt from 'bcryptjs';

export const encrypPassword = async (password: string): Promise<string> => {
   try{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
   } catch (e) {
       console.log('Encryption error (encrypPassword)', e);   
       return 'Encryption error (encrypPassword).';
   }
};



const PasswordHelper = require('../helpers/passwordHelper');

const PASSWORD = 'Test@29292929';
const HASH = '$2b$04$JDJ8gh7.sGj6edZHmkBay.Xc8La7dx1h2SKTZqi5C7q8Wtgj.Mgo2';


describe('Password Helper test suit', () => {
  it('shoud gen a hash from a password', async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD);

    expect(result.length).toBeGreaterThan(10);
  });

  it('should compare a password with hash', async () => {
    const result = await PasswordHelper.comparePassword(PASSWORD, HASH);
    
    expect(result).toBeTruthy();
  })  
});

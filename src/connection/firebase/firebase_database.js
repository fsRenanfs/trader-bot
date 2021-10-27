const { ref, set, remove, onValue } = require('firebase/database');
const { firebaseDatabase } = require('./firebase_service');

const saveObject = (path, object) => {
  set(ref(firebaseDatabase, path), object);
};

const deleteObject = path => {
  remove(ref(firebaseDatabase, path));
};

const listObject = path => {
  const dbRef = ref(firebaseDatabase, path);

  return new Promise(resolve => {
    onValue(dbRef, snapshot => {
      resolve(snapshot.val());
    });
  });
};

const test = async path => {
  const list = await listObject(path);

  for (const value of Object.values(list)) {
    console.log(value);
  }
  console.log('fechou');
};

test('users');

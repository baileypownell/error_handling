import express from 'express';

const app = express();

const port = process.env.PORT || 2000;

const noTryCatches = async () => {
  // results in UnhandledPromiseRejection
  await new Promise((resolve, reject) => {
    resolve('This function has no problems :)');
  });
  await new Promise((resolve, reject) => {
    reject('This function is problematic :( ');
  }); // this function results in an error
  await new Promise((resolve, reject) => {
    reject('This function is also problematic :( ');
  }); // as a result, this function is never called
};

const singleTryCatch = async () => {
  // does NOT result in an UnhandledPromiseRejection, just throws an error
  try {
    await new Promise((resolve, reject) => {
      resolve('This function has no problems :)');
    });
    await new Promise((resolve, reject) => {
      reject('This function is problematic :( ');
    }); // this function results in an error
    await new Promise((resolve, reject) => {
      reject('This function is also problematic :( ');
    }); // as a result, this function is never called
  } catch (error) {
    throw new Error(error);
  }
};

const nestedTryCatch = async () => {
  // does NOT result in an UnhandledPromiseRejection, just throws an error
  try {
    await new Promise((resolve, reject) => {
      resolve('This function has no problems :)');
    });
    try {
      await new Promise((resolve, reject) => {
        reject('This function is problematic :( ');
      }); // this function results in an error
      try {
        await new Promise((resolve, reject) => {
          reject('This function is also problematic :( ');
        }); // as a result, this function is never called
      } catch (error2) {
        throw new Error(error2);
      }
    } catch (error1) {
      throw new Error(error1);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const tryCatchDeepError = async () => {
  // does NOT result in an UnhandledPromiseRejection, just throws an error
  try {
    await new Promise((resolve, reject) => {
      resolve('This function has no problems :)');
    });
    await new Promise((resolve, reject) => {
      resolve('Success :) ');
    });
    await new Promise((resolve, reject) => {
      reject('Deep error :( ');
    });
  } catch (error) {
    // this outer catch() block catches the deep error
    throw new Error(error);
  }
};

const noTryCatchDeepError = async () => {
  // results in an UnhandledPromiseRejection regardless of wheter or not it is ultimately called in try/catch block
  await new Promise((resolve, reject) => {
    resolve('This function has no problems :)');
  });
  await new Promise((resolve, reject) => {
    resolve('Success :) ');
  });
  await new Promise((resolve, reject) => {
    reject('Deep error :( ');
  });
};

app.listen(port, () => {
  console.log(`Project up on port: ${port}`);

  //   noTryCatches(); // kills entire server AND results in an unhandled promise rejection because the function called doesn't use try/catch

  //   singleTryCatch(); // kills entire server

  //   nestedTryCatch(); // kills entire server

  //   tryCatchDeepError(); // kills entire server

  //   noTryCatchDeepError(); // kills entire server AND results in an unhandled promise rejection because the function called doesn't use try/catch
});

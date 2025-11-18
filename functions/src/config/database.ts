import { FirebaseApp, initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore } from 'firebase/firestore';

class Database {
    private app: FirebaseApp;
    private db: Firestore;

    constructor() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APPP_ID
        };

        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);

    }
    async fetchQuestions(): Promise<any> {
        
        const querySnapshot = await getDocs(collection(this.db, 'questions'));
        const data = querySnapshot.docs.map((doc:any) => ({
            id: doc.id,
            ...doc.data()
        }));
        return data;
    }

    async getLevelByScore(score:number): Promise<any> {
        const querySnapshot = await getDocs(collection(this.db, 'levels'));
        const response = querySnapshot.docs.filter((doc:any) => {
            const datadoc = doc.data();

            return score >= datadoc.range.start && score <= datadoc.range.end ;
        });

        const data = response.map((item:any) => ({
            id: item.id,
            ...item.data()
        }));

        return data;
    }
}

export default Database;
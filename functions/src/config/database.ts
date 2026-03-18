import { FirebaseApp, initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore } from 'firebase/firestore';

class Database {
    private app: FirebaseApp;
    private db: Firestore;

    constructor() {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APPP_ID
        };

        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);

    }
    async fetchQuestions(eca:Boolean = false): Promise<any> {
        
        let coll = 'questions'

        if(eca){
            coll = 'eca_questions'
        }
        const querySnapshot = await getDocs(collection(this.db, coll));
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
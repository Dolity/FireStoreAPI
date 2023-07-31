const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credentials = require("../keyFS.json")

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Read All
const GetAgenciesAll = async (req, res) => {
    try {
        const usersRef = db.collection("getCurrency");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch (error) {
        res.send(error);
    }
}

const DeleteDocument = async (req, res) => {
    const { email } = req.params; // รับ docId ที่ต้องการลบมาจาก URL

    try {
        // ลบเอกสารใน Firestore โดยใช้ docId
        const userRecord = await admin.auth().getUserByEmail(email);
        await db.collection("usersPIN").doc(userRecord.uid).delete();
        res.status(200).json({ message: 'ลบเอกสารเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบเอกสาร:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งในภายหลัง' });
    }
};

const DeleteUser = async (req, res) => {
    const { email } = req.params;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().deleteUser(userRecord.uid);
        res.status(200).json({ message: 'ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งในภายหลัง' });
    }
};

const DeleteAll = async (req, res) => {
    const { email } = req.params;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        // Del Authen
        await admin.auth().deleteUser(userRecord.uid);

        // Del Doc
        await db.collection("usersPIN").doc(userRecord.uid).delete();

        res.status(200).json({ message: 'ลบบัญชีผู้ใช้และลบเอกสารเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในลบบัญชีผู้ใช้และลบเอกสาร:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งในภายหลัง' });
    }
};

module.exports = {

    GetAgenciesAll,
    DeleteDocument,
    DeleteUser,
    DeleteAll

}
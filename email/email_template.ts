import { bankTemplate } from "./templates/bank";
import { mainTemplate } from "./templates/main";
import { paypalTemplate } from "./templates/paypal";
import { transactionTemplate } from "./templates/transaction";

export const email_template = {
    BANK_VERIFIED: {
        subject: "Akun Bank Telah Diverifikasi",
        message: "Kami telah memverifikasi akun bank anda. Silahkan lanjutkan menonton video berbayar atau subscribe channel di Aplikasi Nonton untuk mendapatkan lebih banyak uang. Uang yang telah dikumpulkan, akan dikirimkan ke rekening berikut ini pada saat penarikan.",
        template: bankTemplate
    },
    BANK_REJECTED: {
        subject: "Akun Bank Telah Ditolak",
        message: "Saat ini kami belum bisa memverifikasi akun bank yang anda ajukan. Mohon pastikan gambar KTP, Buku Rekening, dan foto wajah anda jelas dan sesuai dengan ketentuan. Informasi lebih lanjut, mohon perhatikan catatan kami di bawah ini.",
        template: bankTemplate,
    },
    BANK_REVISED: {
        subject: "Akun Bank Perlu Revisi",
        message: "Saat ini kami belum bisa memverifikasi akun bank yang anda ajukan. Mohon pastikan gambar KTP, Buku Rekening, dan foto wajah anda jelas dan sesuai dengan ketentuan. Informasi lebih lanjut, mohon perhatikan catatan kami di bawah ini.",
        template: bankTemplate,
    },
    BANK_DEACTIVATED: {
        subject: "Akun Bank Telah Di Nonaktifkan",
        message: "Kami telah meninjau akun bank yang anda ajukan. Berdasarkan pengamatan kami, saat ini anda tidak memenuhi persyaratan untuk mengajukan akun bank di aplikasi Nonton.",
        template: mainTemplate
    },
    BANK_ACTIVATED: {
        subject: "Akun Bank Telah Di Aktifkan",
        message: "Kami telah meninjau akun bank yang anda ajukan. Berdasarkan pengamatan kami, saat ini anda telah memenuhi persyaratan kembali untuk mengajukan akun bank di aplikasi Nonton.",
        template: mainTemplate
    },
    BANK_SUBMITTED: {
        subject: "Pengajuan Akun Bank Telah Diterima",
        message: "Terima kasih telah mengajukan akun bank di aplikasi Nonton. Kami akan segera meninjau dan memverifikasi akun bank yang anda ajukan. Informasi lebih lanjut, mohon perhatikan catatan kami di bawah ini.",
        template: bankTemplate
    },
    BANK_SUBMITTED_TO_ADMIN: {
        subject: "Pengajuan Akun Bank Telah Diterima",
        message: "User telah mengajukan akun bank di aplikasi Nonton. Berikut adalah detail pengajuan akun bank yang diajukan.",
        template: bankTemplate
    },
    WITHDRAW_SUBMITTED: {
        subject: "Pengajuan Penarikan Telah Diterima",
        message: "Terima kasih telah mengajukan penarikan uang di aplikasi Nonton. Kami akan segera meninjau dan memverifikasi akun bank yang anda ajukan. Informasi lebih lanjut, mohon perhatikan catatan kami di bawah ini.",
        template: transactionTemplate
    },
    WITHDRAW_SUBMITTED_TO_ADMIN: {
        subject: "Pengajuan Penarikan Telah Diterima",
        message: "User telah mengajukan penarikan uang di aplikasi Nonton. Berikut adalah detail pengajuan penarikan uang yang diajukan.",
        template: transactionTemplate
    },
    WITHDRAW_SUBMITTED_PAYPAL: {
        subject: "Withdraw Request Submitted",
        message: "Your withdraw request has been submitted. We will review and verify the paypal account you submitted. For more information, please refer to our notes below.",
        template: paypalTemplate
    },
    WITHDRAW_SUBMITTED_PAYPAL_TO_ADMIN: {
        subject: "Withdraw Request Submitted",
        message: "User has submitted a withdraw request in Nonton app. Here are the details of the withdraw request submitted.",
        template: paypalTemplate
    },
}
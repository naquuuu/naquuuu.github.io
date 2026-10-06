catatan pembicara · bahasa indonesia / english
Urutan mengikuti deck blog terbaru. Perkiraan 12 sampai 15 menit termasuk demo dan diskusi; sesuaikan dengan tempo bicara. Cue adalah panduan, bukan untuk dibacakan.

## 1. anything that can go wrong will go wrong

Hai semua. Hari ini saya mau sharing sesuatu yang saya sendiri masih belajar buat lebih konsisten menjalankannya. Jadi, saya datang bukan sebagai expert, tapi sebagai sesama orang yang kadang terlalu senang waktu AI bikin pekerjaan terasa cepat.

Judulnya memang agak pesimis: apa pun yang bisa salah, bisa saja akhirnya salah. Tapi saya tetap optimis dengan manfaat AI. Yang mau saya ajak lebih pesimis justru cara kita merencanakan penggunaannya.

Dalam sekitar lima belas menit, kita akan lihat kenapa hasil yang cepat dan meyakinkan masih perlu diperiksa, lalu empat kebiasaan sederhana yang bisa membantu. Harapannya, kita pulang dengan satu kebiasaan yang bisa dicoba di pekerjaan berikutnya.

Cue: Jeda setelah “terlalu senang”. Pembukaan tenang, seperti mulai ngobrol dengan rekan kerja.

## 2. from a song to a way of working

Sebelum masuk ke idenya, sedikit cerita kenapa saya memilih topik ini. Saya Krishna. Saya suka produk, sistem, dan musik, dan kali ini ketiganya ketemu.

Juni lalu, setelah hubungan yang berlangsung delapan tahun berakhir, musik membantu menenangkan pikiran saya. Belakangan saya menemukan ‘Hukum Murphy’ dari Kafin Sulthan.

Di telinga saya, sound-nya mengingatkan pada French pop tahun tujuh puluhan dan delapan puluhan, lalu Shibuya-kei tahun sembilan puluhan. Itu kesan saya sebagai pendengar. Waktu tahu ini karya musisi Indonesia, reaksinya langsung: ‘C’mon, anak negeri!’ Ada rasa senang menemukan musik yang terasa dekat dengan selera saya.

Buat saya, bakat Kafin luar biasa. Dia juga lulusan Arsitektur Interior UI dan pernah bekerja bersama Candra Darusman lewat Chaseiro. Menarik lihat cara musik dan desain ketemu di satu orang.

Lalu saya mulai memperhatikan lirik dan gagasannya. Murphy yang sebelumnya saya kenal dari konteks engineering ternyata nyambung ke cara kita bekerja di produk: memikirkan apa yang bisa salah, supaya kita lebih siap menghadapi ketidakpastian.

Kemarin di IPC, teman-teman designer, PM, data, dan writer punya pandangan berbeda tentang discovery dan AI. Waktunya habis, sementara pertanyaan dasarnya masih terbuka. Jadi, hari ini saya ingin membagikan cara saya melihatnya. Ini pandangan yang juga masih saya uji.

Dari lagu itu, saya membawa satu pertanyaan ke pekerjaan: ketika AI membuat banyak hal jadi lebih mudah, bagian mana yang tetap perlu kita periksa? Kita mulai dari perubahan yang paling terasa: sekarang, membuat sesuatu jadi jauh lebih murah.

Referensi (tidak dibacakan): https://p-vine.jp/news/20260713-120035 ; https://www.medcom.id/hiburan/musik/JKRAvZQk-kafin-sulthan-ingin-berkolaborasi-dengan-candra-darusman

Cue: Setelah cerita Juni, jeda singkat. Ikuti gerak record dan jalur merah menuju pertanyaan kerja. Tiga bagian cerita mendapat penekanan bergantian. Ucapkan ‘C’mon, anak negeri!’ dengan senyum ringan, lalu hubungkan ke diskusi IPC.

## 3. making got cheap. being right did not.

Sekarang, bikin sesuatu terasa jauh lebih murah. Draft PRD, mockup, atau prototype yang dulu butuh beberapa tahap, sekarang bisa mulai dari satu prompt. Itu membantu sekali.

Di grafik ini, garis gelap menggambarkan usaha untuk membuat sesuatu yang makin turun. Tapi garis merah mengingatkan bahwa akibat dari membuat hal yang salah tetap ada. Kalau harga salah tampil atau voucher gagal dipakai pelanggan, kita tetap harus menangani dampaknya.

Grafik ini ilustrasi, bukan hasil pengukuran. Yang ingin ditunjukkan adalah jaraknya: kita merasa makin cepat, lalu tanpa sadar ikut merasa makin benar. Padahal, kecepatan membuat dan ketepatan hasil itu perlu kita cek secara terpisah.

Cue: Tunjuk kedua garis, lalu beri jeda singkat pada jarak di antara keduanya.

## 4. ai sounds just as sure when it is wrong

Coba kita lihat contoh draft fitur reorder ini. Sekilas, tulisannya rapi dan terdengar siap dibawa ke development. Tapi kalau dibaca pelan, ada beberapa pertanyaan.

Angka dua puluh tiga persen ini asalnya dari mana? Saat pengguna tap reorder, apakah pesanan langsung dibuat? Bagaimana kalau stok habis, harga berubah, atau alamatnya sudah dihapus? Lalu ‘real-time loyalty engine’ ini sistem yang mana?

Ada juga kalimat semua edge case sudah ditangani, tapi kasusnya belum disebutkan. Statusnya ‘ready’, sementara batas scope dan pemilik keputusan belum jelas.

Ini contoh buatan untuk diskusi. Intinya, nada yang yakin belum menjawab pertanyaan tadi. Kita tetap perlu mencari bukti, asumsi, dan keputusan yang sebenarnya masih terbuka.

Cue: Pilih dua atau tiga sorotan di layar. Jangan membacakan seluruh draft.

## 5. four habits, borrowed from things that break

Dari situ, saya mencoba merangkumnya jadi empat kebiasaan. Kita pinjam dari cara orang menghadapi hal-hal yang bisa rusak atau gagal.

Pertama, Murphy: anggap cara yang salah akan dicoba, lalu buat cara itu lebih sulit dilakukan. Kedua, reka peluang: bayangkan kemungkinan gagalnya lebih dulu, termasuk jalan yang kurang enak dibicarakan. Ketiga, sisakan buffer: waktu atau ruang untuk mengecek ketika kenyataan tidak sesuai rencana. Keempat, siapkan recovery supaya kegagalan masih bisa ditangani.

Di beberapa slide berikutnya, kita mulai dari Murphy dan contoh desainnya, lalu masuk ke tiga kebiasaan lain. Kalian nggak perlu mengingat semua istilahnya. Cukup perhatikan mana yang paling sering terlewat dalam cara kita bekerja.

Cue: Gunakan slide ini sebagai peta. Jangan mulai menjelaskan semua contoh secara detail.

## 6. ai adds steps for free. murphy charges for every one.

Bagian ini sedikit hitung-hitungan, tapi idenya sederhana. Bayangkan setiap langkah punya peluang benar sembilan puluh lima persen. Kalau ada sepuluh langkah, peluang setidaknya satu langkah salah menjadi sekitar empat puluh persen. Kalau dua puluh langkah, sekitar enam puluh empat persen.

Angka ini ilustrasi matematika, bukan ukuran akurasi AI. Rumusnya juga mengasumsikan setiap langkah independen, sementara dalam pekerjaan nyata kesalahan bisa saling terkait.

Yang bisa kita ambil: semakin banyak klaim, layar, atau agent yang ditambahkan, semakin banyak bagian yang perlu diperiksa. AI memudahkan kita menambah semuanya. Jadi sebelum menambah langkah lagi, mungkin kita perlu bertanya: ini benar-benar membantu, atau hanya menambah pekerjaan pengecekan?

Cue: Gerakkan slider satu kali. Ulangi singkat bahwa ini ilustrasi dengan asumsi independen.

## 7. murphy's law was a design brief, not a mood

Kisah Murphy yang sering diceritakan berhubungan dengan pengujian rocket sled pada tahun 1949, ketika sensor dipasang dengan cara yang keliru. Saya mengambil pelajaran desainnya: kalau ada cara memasang yang salah, jangan hanya berharap semua orang selalu ingat.

Kita sudah mengenal pendekatan ini. Sudut SIM card membantu menunjukkan orientasinya. USB-C bisa dipasang dari dua arah. Bentuk benda ikut membantu kita melakukan hal yang benar.

Saat bekerja dengan AI, pendekatannya bisa berupa template, schema, nama sistem yang jelas, dan non-goals yang ditulis sejak awal. Jadi sebelum meminta hasil, kita memberi batas yang bisa diperiksa. Halaman kosong terasa bebas, tapi juga memberi banyak ruang untuk asumsi yang tidak kita maksud.

Cue: Tunjuk contoh fisik dulu, baru hubungkan ke template dan batas prompt.

## 8. imagine it already failed. then list why.

Contoh berikutnya memakai kisah kecelakaan bomber tahun 1935 yang sering diceritakan dalam pembahasan checklist: control lock tertinggal, lalu menjadi bagian penting dari kegagalannya. Pelajarannya dekat dengan pekerjaan kita. Orang yang mampu pun bisa melewatkan satu langkah.

Sebelum meminta AI membuat solusi, kita bisa melakukan premortem sederhana. Bayangkan fitur sudah dirilis dan ternyata gagal. Kira-kira kenapa?

Untuk reorder: stok habis, harga berubah, alamat terhapus, voucher sudah dipakai, pengguna double tap, atau pembayaran kedaluwarsa.

Daftar ini bisa menjadi test case, keputusan produk, atau non-goal yang dinyatakan jelas. Jadi sesekali, mulai dari failure list sebelum feature list. Kita memberi kesempatan untuk melihat masalah selagi biaya memperbaikinya masih lebih kecil.

Cue: Berhenti sebentar setelah “kira-kira kenapa”, agar audiens sempat ikut membayangkan.

## 9. slack looks like waste until the bad week

Buffer sering terlihat seperti sesuatu yang bisa dipangkas. Di contoh retail, safety stock terasa berlebihan sampai permintaan naik dan pengiriman terlambat pada saat yang sama. Saat itulah ruang cadangan membantu.

Dalam pekerjaan dengan AI, buffer bisa berupa waktu khusus untuk membaca ulang atau meminta pembaca kedua menantang draft. Kalau memakai model lain, berikan tugas yang spesifik: cari asumsi, klaim tanpa bukti, dan bagian yang belum bisa diuji.

Tentu pembaca atau model kedua juga bisa salah. Karena itu, review tetap butuh keputusan manusia. Kita bisa membatasi dua putaran, lalu memutuskan apa yang diperbaiki atau masih terbuka. Sebagian waktu yang dihemat AI bisa kita pakai untuk pengecekan ini.

Cue: Tekankan “sebagian waktu”. Hindari kesan bahwa semua pekerjaan membutuhkan proses review panjang.

## 10. design the fall, not just the climb

Kisah demonstrasi Otis pada tahun 1854 sering dipakai untuk menjelaskan pendekatan ini. Dalam demonstrasi tersebut, tali dipotong dan mekanisme pengaman menahan platform. Perhatiannya juga diberikan pada apa yang terjadi ketika penopangnya gagal.

Di workflow saya, model yang membangun dan model yang mereview saya pisahkan. Builder membuat draft. Skeptic mencari asumsi yang lemah, klaim tanpa bukti, dan kemungkinan gagal yang belum dibahas. Verifier menjalankan cek yang bisa diulang, misalnya lint, test, dan hasil render. Jadi satu mengecek cara berpikirnya, satu mengecek hal yang bisa diuji.

Model juga punya kemampuan dan batas yang berbeda. Contohnya, Gemini bisa membantu memahami gambar, audio, atau video; untuk implementasi, kita bisa memilih model yang cocok dengan tugas coding. Pilih berdasarkan tugas dan hasil cek kita, bukan sekadar nama model. Reviewer yang berbeda memberi sudut pandang lain, tapi tetap bisa salah atau punya blind spot yang sama.

Kalau review menemukan masalah, hasilnya kembali ke builder. Kalau sudah dirilis dan bermasalah, kita perlu checkpoint atau rollback yang jelas. Lolos review AI belum menjadi keputusan rilis: gate akhirnya tetap manusia.

Saat membangun dengan AI, kita perlu bertanya hal serupa: kalau hasilnya bermasalah, bagaimana kita berhenti atau pulih?

Version control membantu mengembalikan perubahan kode. Prototype bisa ditahan sampai selesai direview. Ketika proses gagal, pengguna perlu tahu statusnya dan langkah berikutnya.

Review membantu menemukan kesalahan, tapi tidak menjamin semuanya tertangkap. Mekanisme Otis memberi gambaran tentang failure yang masih bisa ditahan; analoginya terbatas, karena perubahan perangkat lunak punya penyebab dan dampak yang berbeda. Rollback juga perlu checkpoint yang memang tersedia. Perubahan di sistem luar mungkin membutuhkan penanganan berbeda. Cek jalur pulih dan batasnya sejak awal, jangan menunggu sampai masalah terjadi.

Referensi (tidak dibacakan): https://ai.google.dev/gemini-api/docs/video-understanding

Cue: Ikuti alur builder, dua jenis review, lalu gate manusia. Tunjukkan jalur kembali saat revisi dan rollback.

## 11. optimistic about the goal. pessimistic about every step.

Kalau empat kebiasaan tadi dibawa ke pekerjaan besok, bentuknya cukup sederhana. Sebelum mulai, lihat berapa banyak langkah atau klaim yang kita minta. Tulis non-goals dan beberapa kemungkinan gagal. Sisakan waktu untuk review. Lalu cari tahu bagaimana memperbaiki atau mengembalikan perubahan kalau perlu.

Saya sendiri masih kadang melewatkan ini, terutama ketika hasil pertama sudah kelihatan bagus dan deadline terasa dekat. Jadi ini juga pengingat buat saya.

Kita boleh optimis dengan tujuan dan manfaat AI. Untuk langkah-langkahnya, kita bisa lebih teliti. Membuat sesuatu sekarang lebih mudah; memastikan hasilnya layak dipakai masih menjadi pekerjaan kita. Tidak harus sempurna, tapi jelas apa yang sudah dicek dan apa yang belum.

Cue: Perlambat bagian akhir. Ini tempat merangkum sebelum membuka proses pembuatan deck.

## 12. this deck was made 100% by ai

Dan ada sedikit pengakuan: deck yang kalian lihat ini juga dibuat dengan AI. Maksud tulisan ‘seratus persen’ di sini, AI mengerjakan riset, penulisan, visual, dan pembangunan deck, dengan input dan review manusia.

Saya memberi arah: sudut pembahasan, empat kebiasaan, gaya, dan feedback. Draft pertama terlalu banyak contoh pekerjaan. Draft berikutnya terlalu ingin menunjukkan kemampuan. Arah itu kemudian dikoreksi, dan hasilnya tetap perlu diperiksa manusia.

Diagram ini menunjukkan workflow role di workspace saya, bukan catatan bahwa semua peran selalu dipanggil untuk setiap deck. Naquuuubot mengoordinasikan alur. Curator membantu taste, librarian riset, scribe menyusun cerita, dan builder mengerjakan hasil. Skeptic menantang asumsi; verifier mengecek hal yang bisa diuji. Packet bergerak melewati tiap handoff. Keputusan akhir tetap ada di manusia.

Kalau memakai logika slide matematika tadi, tentu ada banyak bagian yang mungkin salah. Tapi kita tidak punya angka peluang kesalahan untuk deck ini. Anggap itu pengingat kecil: AI bisa membangun bahan presentasinya, sementara kita tetap bertanggung jawab atas yang kita sampaikan.

Cue: Ikuti packet dari input manusia ke naquuuubot, lalu ke authoring dan review roles. Tunjukkan jalur balik dari skeptic sebelum menutup dengan keputusan manusia.

## 13. now the human loop. your turn.

Sekarang saya ingin meminjam mata kalian sebagai pembaca berikutnya. Kalau ada bagian deck ini yang terasa kurang tepat, terlalu menyederhanakan, atau belum menjawab pertanyaan penting, boleh kita bahas.

Mungkin mulai dari satu contoh: pernah ada kemungkinan gagal yang baru terlihat setelah pekerjaan selesai? Atau ada bagian proses yang akan lebih aman kalau diberi sedikit buffer?

Saya ingin dengar bagaimana empat kebiasaan tadi terasa dalam cara kalian bekerja, termasuk kalau ada yang kurang cocok.

Feedback dari percakapan ini bisa menjadi bahan revisi berikutnya. Kita sudah melihat apa yang AI bantu buat; sekarang kita cek bersama bagian yang masih bisa diperbaiki.

Cue: Sisakan 2 sampai 3 menit. Pilih satu pertanyaan pembuka, lalu beri ruang audiens menjawab.

// ============================================================================
// MODUL 5: PELANGGAN TERKAIT, POIN, PIUTANG, SUPPLIER TERKAIT, HUTANG, & STRUK
// ============================================================================

(function() {
    // 1. SUNTIKKAN STYLE KHUSUS KERTAS STRUK BERGERIGI (ZIG-ZAG)
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        .receipt-zigzag-top {
            background: linear-gradient(-45deg, #ffffff 8px, transparent 0), linear-gradient(45deg, #ffffff 8px, transparent 0);
            background-position: left-bottom;
            background-repeat: repeat-x;
            background-size: 16px 16px;
            height: 16px;
            width: 100%;
        }
        .receipt-zigzag-bottom {
            background: linear-gradient(-45deg, transparent 8px, #ffffff 0), linear-gradient(45deg, transparent 8px, #ffffff 0);
            background-position: left-top;
            background-repeat: repeat-x;
            background-size: 16px 16px;
            height: 16px;
            width: 100%;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- ============================================================== -->
        <!-- BAGIAN A: ALUR PELANGGAN TERKAIT (SS 1000920167 - 1000920178)  -->
        <!-- ============================================================== -->

        <!-- 1. LAYAR PELANGGAN TERKAIT (SS 1000920167) -->
        <div id="view-pelanggan-terkait" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePelangganTerkaitView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pelanggan Terkait</h2>
            </div>
            <div class="px-4 py-3.5 bg-slate-50 border-b flex justify-between items-center text-xs">
                <span class="font-bold text-gray-900 text-sm truncate pr-2" id="rel-cust-prod-name">TW SMS Square 2400ml</span>
                <span class="text-gray-500 font-medium flex-shrink-0" id="rel-cust-prod-sku">twsms2400ml</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-pelanggan-terkait-rows"></div>
        </div>

        <!-- 2. LAYAR PROFIL LENGKAP PELANGGAN (SS 1000920168) -->
        <div id="view-customer-profile" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="backFromCustomerProfile()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-12 space-y-5">
                <!-- Avatar Siluet, Ikon Hapus, & Ikon Pensil Edit -->
                <div class="flex flex-col items-center justify-center pt-1">
                    <div class="flex items-center justify-center space-x-7">
                        <button onclick="deleteActiveCustomer()" class="text-red-500 hover:text-red-700 text-xl p-2 transition" title="Hapus Pelanggan">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button onclick="openEditCustomerView()" class="text-emerald-600 hover:text-emerald-800 text-xl p-2 transition" title="Edit Pelanggan">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3 text-center" id="prof-cust-name-title">-</h3>
                </div>

                <!-- Rincian Data Pelanggan -->
                <div class="space-y-3.5 text-xs text-gray-800 pt-2">
                    <div>
                        <span class="text-gray-500 block mb-0.5">Name</span>
                        <span class="font-bold text-gray-900" id="prof-cust-name">-</span>
                    </div>
                    <div>
                        <span class="text-gray-500 block mb-0.5">Tipe Pelanggan</span>
                        <span class="font-bold text-gray-900" id="prof-cust-tier">-</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Poin</span>
                            <span class="font-bold text-gray-900 block" id="prof-cust-points">0 Poin</span>
                            <span class="font-bold text-gray-900 block mt-0.5" id="prof-cust-code">-</span>
                        </div>
                        <button onclick="openCustomerPointActionModal()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base shadow-2xs transition" title="Kelola Poin Pelanggan">
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex-1 min-w-0 pr-3">
                            <span class="text-gray-500 block mb-0.5">Email</span>
                            <span class="font-bold text-gray-900 truncate block" id="prof-cust-email">-</span>
                            <span class="font-bold text-gray-900 block mt-0.5" id="prof-cust-email-sub"></span>
                        </div>
                        <button onclick="sendCustomerEmailAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base flex-shrink-0 shadow-2xs transition">
                            <i class="fa-solid fa-envelope"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Telepon</span>
                            <span class="font-bold text-gray-900" id="prof-cust-phone">-</span>
                        </div>
                        <div class="flex items-center space-x-2.5">
                            <button onclick="callCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-2xs transition"><i class="fa-solid fa-phone"></i></button>
                            <button onclick="smsCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-2xs transition"><i class="fa-solid fa-message"></i></button>
                            <button onclick="waCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base shadow-2xs transition"><i class="fa-brands fa-whatsapp"></i></button>
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-500 block mb-0.5">Alamat</span>
                        <span class="font-bold text-gray-900" id="prof-cust-address">-</span>
                    </div>
                </div>

                <!-- Kartu Piutang (Merah) & Kartu Tunai (Biru) -->
                <div class="space-y-4 pt-2">
                    <!-- Piutang -->
                    <div onclick="openKreditPiutangView()" class="cursor-pointer group">
                        <div class="inline-block bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Piutang</div>
                        <div class="p-4 bg-slate-50 group-hover:bg-slate-100 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-slate-100">
                            <div class="space-y-1">
                                <p class="font-semibold">Tot. piutang : <span id="prof-cust-debt-count">0</span> kali</p>
                                <p class="font-bold text-sm">Tot. sisa piutang : <span id="prof-cust-debt-total">Rp 0</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-700 text-xs"></i>
                        </div>
                    </div>

                    <!-- Tunai -->
                    <div onclick="openCustomerTransactionListView()" class="cursor-pointer group">
                        <div class="inline-block bg-sky-500 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Tunai</div>
                        <div class="p-4 bg-slate-50 group-hover:bg-slate-100 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-slate-100">
                            <div class="space-y-1">
                                <p class="font-bold text-sm">Tot. semua transaksi : <span id="prof-tot-trx-count">87 kali</span></p>
                                <p class="font-bold text-sm">Tot. semua keuntungan : <span id="prof-tot-profit">Rp 1.331.278,74</span></p>
                                <p class="font-bold text-sm">Tot. semua pendapatan : <span id="prof-tot-revenue">Rp 5.618.500</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-700 text-xs"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. LAYAR EDIT PELANGGAN (SS 1000920170) -->
        <div id="view-edit-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="closeEditCustomerView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center">
                    <div class="relative flex items-center justify-center">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button onclick="if(window.openLivePhotoCamera) window.openLivePhotoCamera('customer')" type="button" class="absolute -right-10 bottom-2 text-emerald-700 text-xl p-1">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3">Edit Pelanggan</h3>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Panggilan</label>
                    <input type="text" id="edit-cust-name" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Poin</label>
                    <div class="flex items-center space-x-3">
                        <input type="number" id="edit-cust-points" readonly class="flex-1 bg-slate-100 p-3 px-4 rounded-full text-xs font-semibold text-gray-600 focus:outline-none">
                        <button onclick="openCustomerPointActionModal()" type="button" class="text-emerald-700 hover:text-emerald-900 text-2xl px-1">
                            <i class="fa-regular fa-star"></i>
                        </button>
                    </div>
                    <p class="text-[11px] text-gray-500 mt-1">Set Poin awal dapat diedit di menu Marketing-Loyalti Poin</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kode Pelanggan</label>
                    <div class="flex items-center space-x-3">
                        <input type="text" id="edit-cust-code" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                        <button onclick="if(window.openScannerView) window.openScannerView('customer-code')" type="button" class="text-emerald-700 text-2xl px-1">
                            <i class="fa-solid fa-barcode"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-xs font-semibold text-gray-600">Email (Opsional)</label>
                        <span class="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">i</span>
                    </div>
                    <input type="email" id="edit-cust-email" class="w-full bg-slate-100 border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-700 focus:outline-none focus:bg-white focus:border-emerald-600">
                    <p class="text-[11px] text-gray-500 mt-1">Gunakan email yang valid, atau biarkan kosong</p>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="flex items-center space-x-2">
                        <div class="px-3 py-3 text-sm font-semibold text-gray-800 flex items-center space-x-1">
                            <span>+62</span><i class="fa-solid fa-caret-down text-xs text-gray-500"></i>
                        </div>
                        <input type="text" id="edit-cust-phone" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="edit-cust-address" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Tipe Pelanggan</label>
                    <div class="relative">
                        <select id="edit-cust-tier" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 bg-white appearance-none focus:outline-none focus:border-emerald-600">
                            <option value="-">Pilih Tipe Pelanggan</option>
                            <option value="gold">gold</option>
                            <option value="silver">silver</option>
                            <option value="retailer">retailer</option>
                        </select>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-700">
                            <i class="fa-solid fa-chevron-down text-xs"></i>
                        </span>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveEditCustomerData()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- 4. LAYAR TUKAR POIN PELANGGAN (SS 1000920173) -->
        <div id="view-tukar-poin" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white font-bold text-base shadow-xs">
                Kasir Rejeki Lancar
            </div>
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-xs z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeTukarPoinView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Barang</h2>
                </div>
                <button onclick="redeemSelectedPointItems()" class="text-emerald-700 text-xl p-1" title="Proses Tukar Poin"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
            <div class="px-4 py-3.5 bg-slate-50 border-b flex justify-between items-center text-xs">
                <span class="font-semibold text-gray-700">Poin saat ini</span>
                <span class="font-bold text-gray-900" id="tukar-poin-current-disp">0</span>
            </div>
            <p class="px-4 pt-3 pb-1 text-xs text-gray-600 font-medium">*Poin akan berkurang sesuai kelipatan</p>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-tukar-poin-items"></div>
        </div>

        <!-- 5. LAYAR LOG POIN PELANGGAN (SS 1000920174) -->
        <div id="view-log-poin" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeLogPoinView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Log Poin</h2>
            </div>
            <div class="px-4 py-3.5 bg-slate-50 border-b text-xs space-y-0.5">
                <p class="font-bold text-gray-900 text-sm" id="log-cust-name">-</p>
                <p class="text-gray-600 font-medium" id="log-cust-email">-</p>
            </div>
            <div class="p-4">
                <div class="border border-emerald-600 rounded-xl p-3 flex items-center space-x-3 text-xs font-bold text-gray-900">
                    <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                    <span id="log-poin-date-range">2026-10-10 - 2026-10-10</span>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto px-4 divide-y divide-gray-100" id="container-log-poin-rows"></div>
        </div>

        <!-- 6. LAYAR KREDIT / PIUTANG PELANGGAN (SS 1000920176) -->
        <div id="view-kredit-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeKreditPiutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Kredit/Piutang</h2>
                </div>
                <button onclick="alert('Bagikan tagihan piutang pelanggan via WhatsApp')" class="text-emerald-700 text-xl p-1"><i class="fa-solid fa-share-nodes"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="bg-gradient-to-r from-amber-50/80 via-rose-50/70 to-pink-50/70 rounded-2xl p-4 space-y-3 shadow-2xs border border-rose-100/60">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-xs text-gray-900" id="kp-cust-name">-</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div>
                            <span class="text-gray-600 block">Total Sisa Piutang</span>
                            <span class="font-extrabold text-red-600 text-base mt-0.5 block" id="kp-cust-debt-amount">Rp 0</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-600 block">Total Transaksi</span>
                            <span class="font-extrabold text-gray-900 text-base mt-0.5 block" id="kp-cust-debt-count">0</span>
                        </div>
                    </div>
                    <div class="flex justify-center pt-1">
                        <button onclick="lunasiSekaligusPiutangPelanggan()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-10 rounded-full text-xs shadow-sm transition">
                            Lunasi Sekaligus
                        </button>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button class="text-emerald-700 text-lg px-2"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div class="flex-1 border border-gray-300 rounded-xl p-3 flex justify-between items-center text-xs font-semibold text-gray-900">
                        <div class="flex items-center space-x-2.5">
                            <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                            <span>Semua Transaksi</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-700"></i>
                    </div>
                </div>

                <button onclick="promptBuatPiutangPelanggan()" class="w-full border border-red-700 bg-rose-50/50 hover:bg-rose-50 text-red-700 font-semibold py-3 rounded-full text-xs transition">
                    Buat Piutang
                </button>

                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900">
                        <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600">
                        <span>Daftar Transaksi</span>
                    </label>
                    <div class="border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 flex items-center space-x-3">
                        <span>Belum Lunas</span>
                        <i class="fa-solid fa-chevron-down text-[10px]"></i>
                    </div>
                </div>

                <div id="container-cust-piutang-rows" class="divide-y divide-gray-100 pt-2"></div>
            </div>
        </div>

        <!-- 7. LAYAR LIST TRANSAKSI PENJUALAN PELANGGAN (SS 1000920177) -->
        <div id="view-customer-transactions" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeCustomerTransactionListView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">List Transaksi</h2>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-200" id="list-cust-trx-rows"></div>
        </div>

        <!-- 8. LAYAR STRUK DIGITAL PENJUALAN (SS 1000920178) -->
        <div id="view-digital-receipt" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-600 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeDigitalReceiptView()" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-base font-semibold tracking-wide">STRUK</h2>
                </div>
                <div class="flex items-center space-x-5 text-xl">
                    <button onclick="window.print()" title="Simpan / Cetak Struk"><i class="fa-solid fa-download"></i></button>
                    <button onclick="shareSalesReceiptWA()" title="Bagikan ke WhatsApp"><i class="fa-solid fa-share-nodes"></i></button>
                    <button onclick="alert('Pengaturan Cetak Thermal 58mm / 80mm')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                <div class="w-full max-w-sm shadow-2xl my-2">
                    <div class="receipt-zigzag-top"></div>
                    <div class="bg-white px-6 py-5 font-sans text-xs text-gray-900 space-y-3">
                        <div class="text-center space-y-0.5">
                            <h3 class="font-bold text-lg tracking-wide text-gray-900">REJEKI LANCAR</h3>
                            <p class="text-xs text-gray-800">Toko Macam Plastik</p>
                            <p class="text-xs text-gray-800">Jl. Bromo, PasarBaru, Pujon Lor</p>
                            <p class="text-xs text-gray-800" id="rec-id-struk">151374420261006065251</p>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="flex justify-between items-start text-xs">
                            <div class="space-y-1">
                                <p id="rec-date-disp">2026-10-06</p>
                                <p id="rec-time-disp">06:52:51</p>
                            </div>
                            <div class="text-right space-y-0.5">
                                <p>Kasir : <span id="rec-cashier-disp">Nela</span></p>
                                <p id="rec-customer-disp" class="max-w-[160px] leading-tight">216 Yeyen Laundry BonBayi</p>
                            </div>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="space-y-2 text-xs" id="rec-items-container"></div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="space-y-1.5 text-xs">
                            <div class="flex justify-between">
                                <span>Sub Total</span>
                                <span id="rec-subtotal-disp">Rp 56.000</span>
                            </div>
                            <div class="flex justify-between font-bold text-sm pt-1">
                                <span>Total</span>
                                <span id="rec-total-disp">Rp 56.000</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Bayar (Cash)</span>
                                <span id="rec-paid-disp">Rp 100.000</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Kembali</span>
                                <span id="rec-change-disp">Rp 44.000</span>
                            </div>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="flex justify-between text-xs">
                            <span>Poin Bertambah</span>
                            <span id="rec-earned-points">28</span>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="text-center text-xs text-gray-800 pt-2 leading-snug">
                            Tidak menerima pengembalian<br>
                            barang tanpa perjanjian<br>
                            dan struk pembelian<br>
                            Terimakasih
                        </div>
                    </div>
                    <div class="receipt-zigzag-bottom"></div>
                </div>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN B: ALUR SUPPLIER TERKAIT (SS 1000920221 - 1000920226)   -->
        <!-- ============================================================== -->

        <!-- 9. LAYAR SUPPLIER TERKAIT (SS 1000920221) -->
        <div id="view-supplier-terkait" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeSupplierTerkaitView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Supplier Terkait</h2>
            </div>
            <div class="px-4 py-3.5 bg-slate-50 border-b flex justify-between items-center text-xs">
                <span class="font-bold text-gray-900 text-sm truncate pr-2" id="rel-sup-prod-name">Alta Wrap 30x30 box</span>
                <span class="text-gray-500 font-medium flex-shrink-0" id="rel-sup-prod-sku">alta30x30box</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-supplier-terkait-rows"></div>
        </div>

        <!-- 10. LAYAR DETAIL SUPPLIER (SS 1000920222) -->
        <div id="view-supplier-detail" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="backFromSupplierDetail()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-12 space-y-5">
                <div class="flex flex-col items-center justify-center pt-1">
                    <div class="flex items-center justify-center space-x-7">
                        <button onclick="deleteActiveSupplier()" class="text-emerald-600 hover:text-red-600 text-xl p-2 transition" title="Hapus Supplier">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button onclick="openEditSupplierView()" class="text-emerald-600 hover:text-emerald-800 text-xl p-2 transition" title="Edit Supplier">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3 text-center">Detail Supplier</h3>
                </div>

                <div class="divide-y divide-gray-100 text-xs text-gray-800 pt-2">
                    <div class="py-3">
                        <span class="text-gray-500 block mb-0.5">Nama</span>
                        <span class="font-bold text-gray-900 text-sm" id="prof-sup-name">ALTAwrap PT.SaptaSariTama</span>
                    </div>
                    <div class="py-3 flex justify-between items-center">
                        <div class="flex-1 min-w-0 pr-3">
                            <span class="text-gray-500 block mb-0.5">Email</span>
                            <span class="font-bold text-gray-900 truncate block" id="prof-sup-email">-</span>
                        </div>
                        <button onclick="sendSupplierEmailAction()" class="text-emerald-700 text-2xl flex-shrink-0"><i class="fa-regular fa-envelope"></i></button>
                    </div>
                    <div class="py-3 flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Telepon</span>
                            <span class="font-bold text-gray-900" id="prof-sup-phone">-</span>
                        </div>
                        <div class="flex items-center space-x-4 text-emerald-700 text-2xl">
                            <button onclick="callSupplierAction()"><i class="fa-solid fa-phone-volume"></i></button>
                            <button onclick="smsSupplierAction()"><i class="fa-regular fa-message"></i></button>
                            <button onclick="waSupplierAction()"><i class="fa-brands fa-whatsapp"></i></button>
                        </div>
                    </div>
                    <div class="py-3">
                        <span class="text-gray-500 block mb-0.5">Alamat</span>
                        <span class="font-bold text-gray-900" id="prof-sup-address">-</span>
                    </div>
                    <!-- Baris Hutang Supplier -->
                    <div onclick="openSupplierHutangView()" class="py-3.5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                        <div class="space-y-0.5">
                            <span class="text-gray-500 block">Hutang</span>
                            <p class="font-bold text-gray-900">Tot. hutang : <span id="prof-sup-debt-count">33 kali</span></p>
                            <p class="font-bold text-gray-900">Tot. sisa hutang : <span id="prof-sup-debt-amount">Rp 2.750.000</span></p>
                        </div>
                        <i class="fa-solid fa-chevron-right text-emerald-700 text-base"></i>
                    </div>
                    <!-- Baris Tunai Supplier -->
                    <div onclick="openSupplierTransactionsView()" class="py-3.5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                        <div class="space-y-0.5">
                            <span class="text-gray-500 block">Tunai</span>
                            <p class="font-bold text-gray-900">Tot. semua transaksi : <span id="prof-sup-trx-count">22 kali</span></p>
                        </div>
                        <i class="fa-solid fa-chevron-right text-emerald-700 text-base"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 11. LAYAR EDIT SUPPLIER (SS 1000920223) -->
        <div id="view-edit-supplier" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="closeEditSupplierView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>
            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center border-b pb-5">
                    <div class="relative flex items-center justify-center">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button type="button" class="absolute -right-10 bottom-2 text-emerald-700 text-xl p-1">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3">Edit Supplier</h3>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama</label>
                    <input type="text" id="edit-sup-name" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" id="edit-sup-email" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-500 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="border border-gray-300 rounded-full flex items-center px-4 py-1">
                        <span class="text-xs font-semibold text-gray-800 pr-2 flex items-center space-x-1"><span>+62</span><i class="fa-solid fa-caret-down text-[10px] text-gray-500 ml-1"></i></span>
                        <input type="text" id="edit-sup-phone" class="flex-1 p-2 text-xs font-semibold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="edit-sup-address" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div class="pt-3">
                    <button onclick="saveEditSupplierData()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md transition active:scale-95 text-xs uppercase tracking-wider">
                        SIMPAN
                    </button>
                </div>
            </div>
        </div>

        <!-- 12. LAYAR BUKU HUTANG SUPPLIER (SS 1000920224) -->
        <div id="view-supplier-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeSupplierHutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Hutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="bg-gradient-to-r from-amber-50/80 via-rose-50/70 to-pink-50/70 rounded-2xl p-4 space-y-3 shadow-2xs border border-rose-100/60">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-xs text-gray-900" id="sup-hutang-title-name">ALTAwrap PT.SaptaSariTama</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div>
                            <span class="text-gray-600 block">Total Sisa Hutang</span>
                            <span class="font-extrabold text-red-600 text-base mt-0.5 block" id="sup-hutang-amount-disp">Rp 2.750.000</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-600 block">Total Transaksi</span>
                            <span class="font-extrabold text-gray-900 text-base mt-0.5 block" id="sup-hutang-count-disp">1</span>
                        </div>
                    </div>
                    <div class="flex justify-center pt-1">
                        <button onclick="lunasiSekaligusHutangSupplier()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-10 rounded-full text-xs shadow-sm transition">
                            Lunasi Sekaligus
                        </button>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button class="text-emerald-700 text-lg px-2"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div class="flex-1 border border-gray-300 rounded-xl p-3 flex justify-between items-center text-xs font-semibold text-gray-900">
                        <div class="flex items-center space-x-2.5">
                            <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                            <span>Semua Transaksi</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-700"></i>
                    </div>
                </div>

                <button onclick="promptBuatHutangSupplier()" class="w-full border border-red-700 bg-rose-50/50 hover:bg-rose-50 text-red-700 font-semibold py-3 rounded-full text-xs transition">
                    Buat Hutang
                </button>

                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900">
                        <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600">
                        <span>Daftar Transaksi</span>
                    </label>
                    <div class="border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 flex items-center space-x-3">
                        <span>Belum Lunas</span>
                        <i class="fa-solid fa-chevron-down text-[10px]"></i>
                    </div>
                </div>

                <div id="container-sup-debt-rows" class="divide-y divide-gray-100 pt-2"></div>
            </div>
        </div>

        <!-- 13. LAYAR LIST TRANSAKSI PEMBELIAN SUPPLIER (SS 1000920225) -->
        <div id="view-supplier-transactions" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeSupplierTransactionsView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">List Transaksi</h2>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-200" id="list-sup-trx-rows"></div>
        </div>

        <!-- 14. LAYAR STRUK DIGITAL PEMBELIAN STOK SUPPLIER (SS 1000920226) -->
        <div id="view-supplier-receipt" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-600 hidden relative">
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeSupplierReceiptView()" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-base font-semibold tracking-wide">STRUK</h2>
                </div>
                <div class="flex items-center space-x-5 text-xl">
                    <button onclick="window.print()" title="Simpan / Cetak Struk"><i class="fa-solid fa-download"></i></button>
                    <button onclick="sharePurchaseReceiptWA()" title="Bagikan Struk Pembelian"><i class="fa-solid fa-share-nodes"></i></button>
                    <button onclick="alert('Opsi Struk Pembelian')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                <div class="w-full max-w-sm shadow-2xl my-2">
                    <div class="receipt-zigzag-top"></div>
                    <div class="bg-white px-6 py-5 font-sans text-xs text-gray-900 space-y-3">
                        <div class="text-center space-y-1">
                            <h3 class="font-bold text-sm tracking-wide text-gray-900 uppercase">PEMBELIAN STOK</h3>
                            <p class="text-xs text-gray-800 pt-1" id="sup-rec-id">151374420261006153010</p>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="flex justify-between items-start text-xs">
                            <div class="space-y-1">
                                <p id="sup-rec-date">2026-10-06</p>
                                <p id="sup-rec-time">15:30:10</p>
                                <p>Supplier : <span id="sup-rec-vendor">ALTAwrap P</span></p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm">Admin : <span id="sup-rec-admin">Adm</span></p>
                            </div>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="space-y-2 text-xs" id="sup-rec-items-container"></div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="space-y-1.5 text-xs">
                            <div class="flex justify-between">
                                <span>Sub Total</span>
                                <span id="sup-rec-subtotal">Rp 335.000</span>
                            </div>
                            <div class="flex justify-between font-bold text-sm pt-1">
                                <span>Total</span>
                                <span id="sup-rec-total">Rp 335.000</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Bayar (Non-Cashdrawer)</span>
                                <span id="sup-rec-paid">Rp 335.000</span>
                            </div>
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="text-center font-bold text-xs text-gray-900 py-0.5">
                            Bukan Bukti Pembayaran
                        </div>

                        <div class="border-b border-dashed border-gray-800 my-2"></div>

                        <div class="text-center text-xs text-gray-800 pt-2 pb-1">
                            Struk Pembelian untuk Kepentingan Pencatatan Internal
                        </div>
                    </div>
                    <div class="receipt-zigzag-bottom"></div>
                </div>
            </div>
        </div>

        <!-- 15. LAYAR DIREKTORI UTAMA PELANGGAN & SUPPLIER (DARI MENU SIDEBAR) -->
        <div id="view-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('pos')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-800">Pelanggan &amp; Supplier</h2>
                </div>
            </div>
            <div class="grid grid-cols-2 border-b text-xs font-bold text-center">
                <button id="tab-dir-pelanggan" onclick="switchDirectoryTab('pelanggan')" class="py-3.5 border-b-2 border-emerald-600 text-emerald-700">PELANGGAN</button>
                <button id="tab-dir-supplier" onclick="switchDirectoryTab('supplier')" class="py-3.5 border-b-2 border-transparent text-gray-500">SUPPLIER</button>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="directory-main-list"></div>
        </div>
    `;

    // 3. SUNTIKKAN HTML MODALS POIN PELANGGAN KE DALAM #modals-container
    const modalsHTML = `
        <!-- === MODAL MENU POIN PELANGGAN (SS 1000920171) === -->
        <div id="modal-point-actions" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-md w-full max-w-xs overflow-hidden shadow-2xl">
                <div class="py-4 text-center border-b">
                    <h3 class="font-bold text-xs text-gray-900">Poin Pelanggan</h3>
                </div>
                <div class="p-4 space-y-3 text-xs font-semibold text-gray-900">
                    <button onclick="openAdjustPointsModal()" type="button" class="w-full border border-emerald-500 p-3.5 rounded-md flex justify-between items-center hover:bg-emerald-50 transition">
                        <span>Tambah / Kurang Poin</span>
                        <i class="fa-solid fa-chevron-right text-gray-600 text-sm"></i>
                    </button>
                    <button onclick="openTukarPoinView()" type="button" class="w-full border border-emerald-500 p-3.5 rounded-md flex justify-between items-center hover:bg-emerald-50 transition">
                        <span>Tukar Poin</span>
                        <i class="fa-solid fa-chevron-right text-gray-600 text-sm"></i>
                    </button>
                    <button onclick="openLogPoinView()" type="button" class="w-full border border-emerald-500 p-3.5 rounded-md flex justify-between items-center hover:bg-emerald-50 transition">
                        <span>Log Poin</span>
                        <i class="fa-solid fa-chevron-right text-gray-600 text-sm"></i>
                    </button>
                </div>
                <div class="border-t py-3.5 text-center">
                    <button onclick="closeCustomerPointActionModal()" type="button" class="text-xs font-bold text-emerald-700 hover:underline">Batal</button>
                </div>
            </div>
        </div>

        <!-- === MODAL TAMBAH / KURANG POIN PELANGGAN (SS 1000920172) === -->
        <div id="modal-adjust-points" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-xs overflow-hidden shadow-2xl p-5">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b">POIN PELANGGAN</h3>
                
                <div class="flex items-center space-x-3.5 py-4">
                    <i class="fa-regular fa-star text-emerald-700 text-3xl"></i>
                    <div>
                        <span class="text-[11px] text-gray-500 block">Saat ini</span>
                        <span class="font-bold text-sm text-gray-900" id="adjust-current-points">4393 Poin</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 py-2 text-xs font-semibold text-gray-900">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="adjust_point_mode" value="add" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Tambah</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="adjust_point_mode" value="reduce" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Kurangi</span>
                    </label>
                </div>

                <div class="flex items-center justify-center space-x-5 py-5">
                    <button onclick="changeAdjustPointVal(-1)" type="button" class="w-12 h-12 border border-gray-300 rounded-xl text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition">
                        <i class="fa-solid fa-minus text-base"></i>
                    </button>
                    <input type="number" id="input-adjust-point-val" value="0" min="0" class="w-20 text-center text-2xl font-bold border-b border-gray-400 pb-1 focus:outline-none">
                    <button onclick="changeAdjustPointVal(1)" type="button" class="w-12 h-12 border border-gray-300 rounded-xl text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition">
                        <i class="fa-solid fa-plus text-base"></i>
                    </button>
                </div>

                <div>
                    <input type="text" id="input-adjust-point-notes" placeholder="Keterangan" class="w-full border border-gray-300 p-2.5 px-4 rounded-full text-xs focus:outline-none focus:border-emerald-600">
                </div>

                <div class="grid grid-cols-2 gap-3 mt-4">
                    <button onclick="closeAdjustPointsModal()" type="button" class="border border-emerald-600 text-gray-900 py-3 rounded-lg font-bold text-xs uppercase hover:bg-gray-50 transition">BATAL</button>
                    <button onclick="saveAdjustedPoints()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-xs uppercase transition">OK</button>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // ========================================================================
    // 4. DATA MASTER & LOGIKA JAVASCRIPT PELANGGAN DAN SUPPLIER
    // ========================================================================
    window.customersList = [
        {
            id: "cust_216",
            avatarCode: "21",
            name: "216 Yeyen Laundry BonBayi",
            code: "1-216",
            points: 4393,
            relatedDisplayPoints: 0,
            tier: "-",
            email: "1216yeyenlaundrybonbayi151@gmail.com",
            phone: "81",
            address: "Pandesari",
            debtCount: 0,
            debtTotal: 0,
            trxCount: 87,
            totalProfit: 1331278.74,
            totalRevenue: 5618500,
            pointLogs: [],
            piutangList: []
        },
        {
            id: "cust_274",
            avatarCode: "27",
            name: "274 Fika Maron",
            code: "1-274",
            points: 120,
            relatedDisplayPoints: 0,
            tier: "-",
            email: "fikamaron274@gmail.com",
            phone: "812345678",
            address: "Maron, Pujon",
            debtCount: 0,
            debtTotal: 0,
            trxCount: 19,
            totalProfit: 245000,
            totalRevenue: 1120000,
            pointLogs: [],
            piutangList: []
        },
        {
            id: "cust_042",
            avatarCode: "04",
            name: "042 Bu Sih Empog blkg Smai",
            code: "1-042",
            points: 85,
            relatedDisplayPoints: 0,
            tier: "-",
            email: "busihempog042@gmail.com",
            phone: "856789012",
            address: "Belakang SMAI Pujon",
            debtCount: 0,
            debtTotal: 0,
            trxCount: 14,
            totalProfit: 190500,
            totalRevenue: 890000,
            pointLogs: [],
            piutangList: []
        }
    ];

    window.customerSalesHistory = [
        {
            id: "151374420261006065251",
            dateStr: "2026-10-06",
            day: "06",
            monthYear: "Okt 2026",
            time: "06:52:51",
            pendapatan: 0,
            keuntungan: 12400,
            kasir: "Nela",
            paid: 100000,
            change: 44000,
            pointsEarned: 28,
            items: [
                { name: "OCup 14oz", qty: 2, unit: "slop", price: 10000, total: 20000 },
                { name: "OCup 16oz", qty: 2, unit: "slop", price: 10000, total: 20000 },
                { name: "Foam KCS2 Mie", qty: 20, unit: "pcs", price: 400, total: 8000 },
                { name: "Sticker Terima Kasih 500", qty: 1, unit: "roll", price: 8000, total: 8000 }
            ]
        },
        {
            id: "151374420260930070740",
            dateStr: "2026-09-30",
            day: "30",
            monthYear: "Sep 2026",
            time: "07:07:40",
            pendapatan: 0,
            keuntungan: 5975,
            kasir: "Nela",
            paid: 50000,
            change: 18000,
            pointsEarned: 16,
            items: [
                { name: "OCup 14oz", qty: 2, unit: "slop", price: 10000, total: 20000 },
                { name: "Kresek Hitam 24", qty: 1, unit: "pak", price: 12000, total: 12000 }
            ]
        },
        {
            id: "151374420260925153142",
            dateStr: "2026-09-25",
            day: "25",
            monthYear: "Sep 2026",
            time: "15:31:42",
            pendapatan: 0,
            keuntungan: 48525,
            kasir: "Nela",
            paid: 200000,
            change: 15000,
            pointsEarned: 92,
            items: [
                { name: "TW SMS Square 2400ml", qty: 5, unit: "pak", price: 37000, total: 185000 }
            ]
        },
        {
            id: "151374420260921153129",
            dateStr: "2026-09-21",
            day: "21",
            monthYear: "Sep 2026",
            time: "15:31:29",
            pendapatan: 0,
            keuntungan: 6400,
            kasir: "Nela",
            paid: 50000,
            change: 22000,
            pointsEarned: 14,
            items: [
                { name: "Wrap Refill Klinpak 37x38", qty: 1, unit: "roll", price: 28000, total: 28000 }
            ]
        },
        {
            id: "151374420260919111742",
            dateStr: "2026-09-19",
            day: "19",
            monthYear: "Sep 2026",
            time: "11:17:42",
            pendapatan: 0,
            keuntungan: 19483.32,
            kasir: "Nela",
            paid: 100000,
            change: 25000,
            pointsEarned: 37,
            items: [
                { name: "OCup 16oz", qty: 5, unit: "slop", price: 10000, total: 50000 },
                { name: "Sedotan Steril Hitam", qty: 5, unit: "pak", price: 5000, total: 25000 }
            ]
        },
        {
            id: "151374420260918065933",
            dateStr: "2026-09-18",
            day: "18",
            monthYear: "Sep 2026",
            time: "06:59:33",
            pendapatan: 0,
            keuntungan: 12775,
            kasir: "Nela",
            paid: 100000,
            change: 40000,
            pointsEarned: 30,
            items: [
                { name: "Foam KCS2 Mie", qty: 150, unit: "pcs", price: 400, total: 60000 }
            ]
        },
        {
            id: "151374420260917073847",
            dateStr: "2026-09-17",
            day: "17",
            monthYear: "Sep 2026",
            time: "07:38:47",
            pendapatan: 0,
            keuntungan: 2832,
            kasir: "Nela",
            paid: 20000,
            change: 4000,
            pointsEarned: 8,
            items: [
                { name: "Sticker Terima Kasih 500", qty: 2, unit: "roll", price: 8000, total: 16000 }
            ]
        }
    ];

    window.suppliersList = [
        {
            id: "sup_alta",
            avatarCode: "AL",
            name: "ALTAwrap PT.SaptaSariTama",
            email: "altawrappt.saptasaritama1513744@kasirpintar.co.id",
            phone: "81914831183",
            address: "malang, tlogomas",
            debtCount: 33,
            debtAmount: 2750000,
            trxCount: 22,
            debts: [
                { id: "debt_1", date: "02/10/2026", dueDate: "2026/10/14", status: "Belum lunas", amount: 2750000 }
            ]
        },
        {
            id: "sup_tj",
            avatarCode: "TU",
            name: "Tunggal Jaya (MMP)",
            email: "tunggaljayammp@gmail.com",
            phone: "81234567890",
            address: "Malang",
            debtCount: 0,
            debtAmount: 0,
            trxCount: 12,
            debts: []
        }
    ];

    window.supplierPurchaseHistory = [
        {
            id: "16356320220808173558",
            receiptId: "151374420261006153010",
            dateStr: "2026-10-06",
            day: "06",
            monthYear: "Okt 2026",
            time: "15:30:10",
            pengeluaran: 335000,
            admin: "Adm",
            vendorShort: "ALTAwrap P",
            items: [
                { name: "Alta Baking Paper Wrap 30x10", qty: 10, unit: "box", price: 21000, total: 210000 },
                { name: "Alta Alu Foil Box 30x8m", qty: 10, unit: "box", price: 12500, total: 125000 }
            ]
        },
        { id: "16356320220808173558", receiptId: "151374420260929142641", dateStr: "2026-09-29", day: "29", monthYear: "Sep 2026", time: "14:26:41", pengeluaran: 528031.68, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 30x30 box", qty: 33, unit: "box", price: 16000.96, total: 528031.68 }] },
        { id: "16356320220808173558", receiptId: "151374420260925135822", dateStr: "2026-09-25", day: "25", monthYear: "Sep 2026", time: "13:58:22", pengeluaran: 2750000, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 30x30 dus", qty: 10, unit: "dus", price: 275000, total: 2750000 }] },
        { id: "16356320220808173558", receiptId: "151374420260915151501", dateStr: "2026-09-15", day: "15", monthYear: "Sep 2026", time: "15:15:01", pengeluaran: 1630169.14, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 37x38 box", qty: 70, unit: "box", price: 23288.13, total: 1630169.14 }] },
        { id: "16356320220808173558", receiptId: "151374420260909163719", dateStr: "2026-09-09", day: "09", monthYear: "Sep 2026", time: "16:37:19", pengeluaran: 820000, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Baking Paper", qty: 40, unit: "box", price: 20500, total: 820000 }] },
        { id: "16356320220808173558", receiptId: "151374420260901135345", dateStr: "2026-09-01", day: "01", monthYear: "Sep 2026", time: "13:53:45", pengeluaran: 1068091.68, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 30x30 box", qty: 66, unit: "box", price: 16183.2, total: 1068091.68 }] },
        { id: "16356320220808173558", receiptId: "151374420260831134528", dateStr: "2026-08-31", day: "31", monthYear: "Aug 2026", time: "13:45:28", pengeluaran: 2750000, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 30x30 dus", qty: 10, unit: "dus", price: 275000, total: 2750000 }] },
        { id: "16356320220808173558", receiptId: "151374420260821145624", dateStr: "2026-08-21", day: "21", monthYear: "Aug 2026", time: "14:56:24", pengeluaran: 4150000, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap Paket Grosir", qty: 15, unit: "dus", price: 276666.67, total: 4150000 }] },
        { id: "16356320220808173558", receiptId: "151374420260807130434", dateStr: "2026-08-07", day: "07", monthYear: "Aug 2026", time: "13:04:34", pengeluaran: 1660192.6, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Alu Foil", qty: 100, unit: "box", price: 16601.926, total: 1660192.6 }] },
        { id: "16356320220808173558", receiptId: "151374420260729112222", dateStr: "2026-07-29", day: "29", monthYear: "Jul 2026", time: "11:22:22", pengeluaran: 5500000, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap 30x30 dus", qty: 20, unit: "dus", price: 275000, total: 5500000 }] },
        { id: "16356320220808173558", receiptId: "151374420260715133247", dateStr: "2026-07-15", day: "15", monthYear: "Jul 2026", time: "13:32:47", pengeluaran: 2950375, admin: "Adm", vendorShort: "ALTAwrap P", items: [{ name: "Alta Wrap Campur", qty: 11, unit: "dus", price: 268215.9, total: 2950375 }] }
    ];

    let activeCustomer = window.customersList[0];
    let activeSupplier = window.suppliersList[0];
    let openedFromDirectory = false;

    // ========================================================================
    // 5. FUNGSI ALUR PELANGGAN TERKAIT (SS 1000920167 - 1000920178)
    // ========================================================================
    window.openPelangganTerkaitView = () => {
        openedFromDirectory = false;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pelanggan-terkait').classList.remove('hidden');

        const p = window.activeDetailProduct;
        document.getElementById('rel-cust-prod-name').innerText = p && p.name ? p.name : 'TW SMS Square 2400ml';
        document.getElementById('rel-cust-prod-sku').innerText = p && p.sku ? p.sku : 'twsms2400ml';

        const container = document.getElementById('list-pelanggan-terkait-rows');
        container.innerHTML = '';

        window.customersList.forEach(cust => {
            container.innerHTML += `
                <div onclick="openCustomerProfileView('${cust.id}')" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-4 flex-1 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                            ${cust.avatarCode}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${cust.name}</h4>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="text-xs font-bold text-emerald-600">${cust.relatedDisplayPoints} Poin</span>
                    </div>
                </div>
            `;
        });
    };

    window.closePelangganTerkaitView = () => {
        document.getElementById('view-pelanggan-terkait').classList.add('hidden');
        document.getElementById('view-product-detail').classList.remove('hidden');
    };

    window.backFromCustomerProfile = () => {
        document.getElementById('view-customer-profile').classList.add('hidden');
        if (openedFromDirectory) {
            document.getElementById('view-pelanggan').classList.remove('hidden');
        } else {
            document.getElementById('view-pelanggan-terkait').classList.remove('hidden');
        }
    };

    window.openCustomerProfileView = (custId) => {
        const c = window.customersList.find(x => x.id === custId) || window.customersList[0];
        activeCustomer = c;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-customer-profile').classList.remove('hidden');

        document.getElementById('prof-cust-name-title').innerText = c.name;
        document.getElementById('prof-cust-name').innerText = c.name;
        document.getElementById('prof-cust-tier').innerText = c.tier || '-';
        document.getElementById('prof-cust-points').innerText = `${c.points} Poin`;
        document.getElementById('prof-cust-code').innerText = c.code || '-';
        document.getElementById('prof-cust-email').innerText = c.email || '-';
        document.getElementById('prof-cust-email-sub').innerText = `(${c.name})`;
        document.getElementById('prof-cust-phone').innerText = c.phone || '-';
        document.getElementById('prof-cust-address').innerText = c.address || '-';

        document.getElementById('prof-cust-debt-count').innerText = c.debtCount || 0;
        document.getElementById('prof-cust-debt-total').innerText = `Rp ${Number(c.debtTotal || 0).toLocaleString('id-ID')}`;
        document.getElementById('prof-tot-trx-count').innerText = `${c.trxCount || 87} kali`;
        document.getElementById('prof-tot-profit').innerText = `Rp ${Number(c.totalProfit || 0).toLocaleString('id-ID')}`;
        document.getElementById('prof-tot-revenue').innerText = `Rp ${Number(c.totalRevenue || 0).toLocaleString('id-ID')}`;
    };

    window.deleteActiveCustomer = () => {
        if (!activeCustomer) return;
        if (confirm(`Yakin ingin menghapus pelanggan '${activeCustomer.name}'?`)) {
            window.customersList = window.customersList.filter(x => x.id !== activeCustomer.id);
            window.openPelangganTerkaitView();
        }
    };

    window.sendCustomerEmailAction = () => {
        if (activeCustomer && activeCustomer.email) window.location.href = `mailto:${activeCustomer.email}`;
    };
    window.callCustomerAction = () => {
        if (activeCustomer && activeCustomer.phone) window.location.href = `tel:+62${activeCustomer.phone}`;
    };
    window.smsCustomerAction = () => {
        if (activeCustomer && activeCustomer.phone) window.location.href = `sms:+62${activeCustomer.phone}`;
    };
    window.waCustomerAction = () => {
        if (activeCustomer && activeCustomer.phone) window.open(`https://wa.me/62${activeCustomer.phone}`, '_blank');
    };

    // --- EDIT PELANGGAN (SS 1000920170) ---
    window.openEditCustomerView = () => {
        if (!activeCustomer) return;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-edit-pelanggan').classList.remove('hidden');

        document.getElementById('edit-cust-name').value = activeCustomer.name || '';
        document.getElementById('edit-cust-points').value = activeCustomer.points || 0;
        document.getElementById('edit-cust-code').value = activeCustomer.code || '';
        document.getElementById('edit-cust-email').value = activeCustomer.email || '';
        document.getElementById('edit-cust-phone').value = activeCustomer.phone || '';
        document.getElementById('edit-cust-address').value = activeCustomer.address || '';
        document.getElementById('edit-cust-tier').value = activeCustomer.tier || '-';
    };

    window.closeEditCustomerView = () => {
        document.getElementById('view-edit-pelanggan').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };

    window.saveEditCustomerData = () => {
        if (!activeCustomer) return;
        const name = document.getElementById('edit-cust-name').value.trim();
        if (!name) return alert("Nama panggilan pelanggan wajib diisi!");

        activeCustomer.name = name;
        activeCustomer.code = document.getElementById('edit-cust-code').value.trim();
        activeCustomer.email = document.getElementById('edit-cust-email').value.trim();
        activeCustomer.phone = document.getElementById('edit-cust-phone').value.trim();
        activeCustomer.address = document.getElementById('edit-cust-address').value.trim();
        activeCustomer.tier = document.getElementById('edit-cust-tier').value;

        alert("Data pelanggan berhasil disimpan!");
        window.closeEditCustomerView();
        window.openCustomerProfileView(activeCustomer.id);
    };

    // --- MENU POIN PELANGGAN: TAMBAH/KURANG, TUKAR POIN, & LOG POIN (SS 1000920171 - 1000920174) ---
    window.openCustomerPointActionModal = () => {
        document.getElementById('modal-point-actions').classList.remove('hidden');
    };
    window.closeCustomerPointActionModal = () => {
        document.getElementById('modal-point-actions').classList.add('hidden');
    };

    // 1. Tambah / Kurang Poin (SS 1000920172)
    window.openAdjustPointsModal = () => {
        window.closeCustomerPointActionModal();
        document.getElementById('adjust-current-points').innerText = `${activeCustomer.points || 0} Poin`;
        document.querySelector('input[name="adjust_point_mode"][value="add"]').checked = true;
        document.getElementById('input-adjust-point-val').value = '0';
        document.getElementById('input-adjust-point-notes').value = '';
        document.getElementById('modal-adjust-points').classList.remove('hidden');
    };

    window.closeAdjustPointsModal = () => {
        document.getElementById('modal-adjust-points').classList.add('hidden');
    };

    window.changeAdjustPointVal = (delta) => {
        const input = document.getElementById('input-adjust-point-val');
        let val = Number(input.value) || 0;
        val += delta;
        if (val < 0) val = 0;
        input.value = val;
    };

    window.saveAdjustedPoints = () => {
        const mode = document.querySelector('input[name="adjust_point_mode"]:checked').value;
        const delta = Number(document.getElementById('input-adjust-point-val').value) || 0;
        const notes = document.getElementById('input-adjust-point-notes').value.trim() || (mode === 'add' ? 'Tambah Poin Manual' : 'Kurangi Poin Manual');

        if (delta <= 0) return alert("Masukkan jumlah poin lebih dari 0!");

        const oldPts = Number(activeCustomer.points) || 0;
        const newPts = mode === 'add' ? (oldPts + delta) : Math.max(0, oldPts - delta);
        activeCustomer.points = newPts;

        if (!Array.isArray(activeCustomer.pointLogs)) activeCustomer.pointLogs = [];
        activeCustomer.pointLogs.unshift({
            date: window.getFormattedCurrentDateTime(),
            mode: mode,
            delta: delta,
            finalPoints: newPts,
            notes: notes
        });

        // Update tampilan di Profil maupun Edit Pelanggan
        document.getElementById('prof-cust-points').innerText = `${newPts} Poin`;
        const editPtsEl = document.getElementById('edit-cust-points');
        if (editPtsEl) editPtsEl.value = newPts;

        window.closeAdjustPointsModal();
        alert(`Poin pelanggan berhasil diperbarui menjadi ${newPts} Poin!`);
    };

    // 2. Tukar Poin (SS 1000920173)
    const defaultRedeemItems = [
        { initials: "Bt", name: "Btl ShortNeck 100ml", sku: "btlshortnect100ml", pointCost: 10 },
        { initials: "Cu", name: "Cutter FLEXoffice Box Merah pcs", sku: "8935219483011", pointCost: 25 },
        { initials: "Le", name: "Lemper kain ®", sku: "lemperkainpesanan", pointCost: 15 },
        { initials: "Tu", name: "Tutup Bowl saja 650ml/800ml", sku: "tutupkami650800", pointCost: 5 }
    ];

    window.openTukarPoinView = () => {
        window.closeCustomerPointActionModal();
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tukar-poin').classList.remove('hidden');

        document.getElementById('tukar-poin-current-disp').innerText = activeCustomer.relatedDisplayPoints || 0;

        const container = document.getElementById('list-tukar-poin-items');
        container.innerHTML = '';

        defaultRedeemItems.forEach((item, idx) => {
            container.innerHTML += `
                <label class="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition">
                    <input type="checkbox" name="chk_redeem_item" value="${idx}" class="w-5 h-5 border-2 border-gray-500 rounded text-emerald-600 focus:ring-emerald-500">
                    <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-sm text-slate-400 flex-shrink-0">
                        ${item.initials}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="font-bold text-xs text-gray-900 truncate">${item.name}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">${item.sku}</p>
                    </div>
                </label>
            `;
        });
    };

    window.closeTukarPoinView = () => {
        document.getElementById('view-tukar-poin').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };

    window.redeemSelectedPointItems = () => {
        const checked = document.querySelectorAll('input[name="chk_redeem_item"]:checked');
        if (checked.length === 0) return alert("Pilih barang yang akan ditukar dengan poin terlebih dahulu!");
        alert(`${checked.length} barang dipilih untuk penukaran poin.`);
    };

    // 3. Log Poin (SS 1000920174)
    window.openLogPoinView = () => {
        window.closeCustomerPointActionModal();
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-log-poin').classList.remove('hidden');

        document.getElementById('log-cust-name').innerText = activeCustomer.name || '-';
        document.getElementById('log-cust-email').innerText = activeCustomer.email || '-';

        const container = document.getElementById('container-log-poin-rows');
        container.innerHTML = '';

        if (!activeCustomer.pointLogs || activeCustomer.pointLogs.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tidak ada data</div>`;
            return;
        }

        activeCustomer.pointLogs.forEach(log => {
            const badgeColor = log.mode === 'add' ? 'text-emerald-600' : 'text-red-500';
            const sign = log.mode === 'add' ? '+' : '-';
            container.innerHTML += `
                <div class="py-3 flex justify-between items-center text-xs">
                    <div>
                        <p class="font-bold text-gray-900">${log.notes}</p>
                        <p class="text-[11px] text-gray-500 mt-0.5">${log.date}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-extrabold ${badgeColor}">${sign}${log.delta} Poin</span>
                        <span class="block text-[10px] text-gray-400">Saldo: ${log.finalPoints}</span>
                    </div>
                </div>
            `;
        });
    };

    window.closeLogPoinView = () => {
        document.getElementById('view-log-poin').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };

    // --- KREDIT / PIUTANG PELANGGAN (SS 1000920176) ---
    window.openKreditPiutangView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
        renderKreditPiutangPelanggan();
    };

    window.closeKreditPiutangView = () => {
        document.getElementById('view-kredit-piutang').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
        window.openCustomerProfileView(activeCustomer.id);
    };

    function renderKreditPiutangPelanggan() {
        document.getElementById('kp-cust-name').innerText = activeCustomer.name || '-';
        document.getElementById('kp-cust-debt-amount').innerText = `Rp ${Number(activeCustomer.debtTotal || 0).toLocaleString('id-ID')}`;
        document.getElementById('kp-cust-debt-count').innerText = activeCustomer.debtCount || 0;

        const container = document.getElementById('container-cust-piutang-rows');
        container.innerHTML = '';

        if (!activeCustomer.piutangList || activeCustomer.piutangList.length === 0) {
            return;
        }

        activeCustomer.piutangList.forEach(item => {
            container.innerHTML += `
                <div class="py-3.5 flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-3.5">
                        <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600">
                        <div class="space-y-0.5">
                            <span class="text-emerald-600 font-bold block">${item.date}</span>
                            <span class="text-gray-700 font-semibold block">Belum Dibayar</span>
                            <span class="text-gray-600 font-semibold block">Jatuh Tempo ${item.dueDate}</span>
                        </div>
                    </div>
                    <div class="text-right space-y-1">
                        <span class="inline-flex items-center text-gray-800 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-red-700 mr-1.5"></span>Belum lunas</span>
                        <p class="font-bold text-gray-900">Rp ${Number(item.amount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    }

    window.promptBuatPiutangPelanggan = () => {
        const nominal = Number(prompt("Masukkan nominal piutang baru (Rp):", "0")) || 0;
        if (nominal <= 0) return;
        if (!Array.isArray(activeCustomer.piutangList)) activeCustomer.piutangList = [];
        activeCustomer.piutangList.push({
            date: "12/10/2026",
            dueDate: "2026/10/26",
            amount: nominal
        });
        activeCustomer.debtCount = activeCustomer.piutangList.length;
        activeCustomer.debtTotal = (Number(activeCustomer.debtTotal) || 0) + nominal;
        renderKreditPiutangPelanggan();
    };

    window.lunasiSekaligusPiutangPelanggan = () => {
        if (!activeCustomer.debtTotal || activeCustomer.debtTotal <= 0) {
            return alert("Tidak ada tagihan piutang yang perlu dilunasi.");
        }
        if (confirm(`Lunasi seluruh piutang ${activeCustomer.name} sebesar Rp ${Number(activeCustomer.debtTotal).toLocaleString('id-ID')}?`)) {
            activeCustomer.piutangList = [];
            activeCustomer.debtCount = 0;
            activeCustomer.debtTotal = 0;
            renderKreditPiutangPelanggan();
            alert("Seluruh piutang pelanggan telah dilunasi!");
        }
    };

    // --- LIST TRANSAKSI & STRUK DIGITAL PENJUALAN (SS 1000920177 & 1000920178) ---
    window.openCustomerTransactionListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-customer-transactions').classList.remove('hidden');

        const container = document.getElementById('list-cust-trx-rows');
        container.innerHTML = '';

        window.customerSalesHistory.forEach((trx, idx) => {
            container.innerHTML += `
                <div onclick="openDigitalReceiptView(${idx})" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-start space-x-5 flex-1 min-w-0 pr-2">
                        <div class="w-16 flex-shrink-0">
                            <span class="text-xs text-gray-800 font-semibold block">${trx.time}</span>
                            <div class="flex items-center space-x-1.5 mt-1">
                                <span class="text-2xl font-extrabold text-gray-900">${trx.day}</span>
                                <span class="text-[11px] text-gray-500 leading-tight block">${trx.monthYear.replace(' ', '<br>')}</span>
                            </div>
                        </div>
                        <div class="min-w-0 flex-1 text-xs space-y-0.5">
                            <p class="text-gray-500">Pendapatan</p>
                            <p class="font-bold text-gray-900">Rp ${Number(trx.pendapatan).toLocaleString('id-ID')}</p>
                            <p class="text-gray-500 pt-1">Keuntungan</p>
                            <p class="font-bold text-gray-900">Rp ${Number(trx.keuntungan).toLocaleString('id-ID')}</p>
                            <p class="text-xs text-gray-600 font-medium pt-1 truncate">No : ${trx.id}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-3 flex-shrink-0">
                        <button onclick="event.stopPropagation(); deleteCustomerTrxRow(${idx})" class="text-red-500 hover:text-red-700 text-xl"><i class="fa-regular fa-trash-can"></i></button>
                        <i class="fa-solid fa-arrow-right text-emerald-600 text-base"></i>
                        <i class="fa-solid fa-clone text-emerald-600 text-sm"></i>
                    </div>
                </div>
            `;
        });
    };

    window.closeCustomerTransactionListView = () => {
        document.getElementById('view-customer-transactions').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };

    window.deleteCustomerTrxRow = (idx) => {
        const trx = window.customerSalesHistory[idx];
        if (confirm(`Hapus riwayat transaksi No : ${trx.id}?`)) {
            window.customerSalesHistory.splice(idx, 1);
            window.openCustomerTransactionListView();
        }
    };

    window.openDigitalReceiptView = (idx = 0) => {
        const trx = window.customerSalesHistory[idx] || window.customerSalesHistory[0];
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-digital-receipt').classList.remove('hidden');

        document.getElementById('rec-id-struk').innerText = trx.id;
        document.getElementById('rec-date-disp').innerText = trx.dateStr;
        document.getElementById('rec-time-disp').innerText = trx.time;
        document.getElementById('rec-cashier-disp').innerText = trx.kasir;
        document.getElementById('rec-customer-disp').innerText = activeCustomer ? activeCustomer.name : "216 Yeyen Laundry BonBayi";

        const itemsContainer = document.getElementById('rec-items-container');
        itemsContainer.innerHTML = '';

        let subtotal = 0;
        (trx.items || []).forEach(item => {
            subtotal += item.total;
            itemsContainer.innerHTML += `
                <div>
                    <p class="font-bold text-gray-900">${item.name}</p>
                    <div class="flex justify-between text-gray-800 mt-0.5">
                        <span>${item.qty} ${item.unit} x Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                        <span>Rp ${Number(item.total).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('rec-subtotal-disp').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('rec-total-disp').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('rec-paid-disp').innerText = `Rp ${Number(trx.paid).toLocaleString('id-ID')}`;
        document.getElementById('rec-change-disp').innerText = `Rp ${Number(trx.change).toLocaleString('id-ID')}`;
        document.getElementById('rec-earned-points').innerText = trx.pointsEarned;
    };

    window.closeDigitalReceiptView = () => {
        document.getElementById('view-digital-receipt').classList.add('hidden');
        document.getElementById('view-customer-transactions').classList.remove('hidden');
    };

    window.shareSalesReceiptWA = () => {
        const id = document.getElementById('rec-id-struk').innerText;
        const tot = document.getElementById('rec-total-disp').innerText;
        const text = encodeURIComponent(`*STRUK PEMBELIAN REJEKI LANCAR*\nNo: ${id}\nPelanggan: ${activeCustomer.name}\nTotal: ${tot}\nTerima kasih telah berbelanja!`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    // ========================================================================
    // 6. FUNGSI ALUR SUPPLIER TERKAIT (SS 1000920221 - 1000920226)
    // ========================================================================
    window.openSupplierTerkaitView = () => {
        openedFromDirectory = false;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-terkait').classList.remove('hidden');

        const p = window.activeDetailProduct;
        document.getElementById('rel-sup-prod-name').innerText = p && p.name ? p.name : 'Alta Wrap 30x30 box';
        document.getElementById('rel-sup-prod-sku').innerText = p && p.sku ? p.sku : 'alta30x30box';

        const container = document.getElementById('list-supplier-terkait-rows');
        container.innerHTML = '';

        window.suppliersList.forEach(sup => {
            container.innerHTML += `
                <div onclick="openSupplierDetailView('${sup.id}')" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                        ${sup.avatarCode}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="font-bold text-xs text-gray-900 truncate">${sup.name}</h4>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">${sup.email}</p>
                    </div>
                </div>
            `;
        });
    };

    window.closeSupplierTerkaitView = () => {
        document.getElementById('view-supplier-terkait').classList.add('hidden');
        document.getElementById('view-product-detail').classList.remove('hidden');
    };

    window.backFromSupplierDetail = () => {
        document.getElementById('view-supplier-detail').classList.add('hidden');
        if (openedFromDirectory) {
            document.getElementById('view-pelanggan').classList.remove('hidden');
        } else {
            document.getElementById('view-supplier-terkait').classList.remove('hidden');
        }
    };

    window.openSupplierDetailView = (supId) => {
        const s = window.suppliersList.find(x => x.id === supId) || window.suppliersList[0];
        activeSupplier = s;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-detail').classList.remove('hidden');

        document.getElementById('prof-sup-name').innerText = s.name;
        document.getElementById('prof-sup-email').innerText = s.email;
        document.getElementById('prof-sup-phone').innerText = `+62${s.phone}`;
        document.getElementById('prof-sup-address').innerText = s.address;
        document.getElementById('prof-sup-debt-count').innerText = `${s.debtCount} kali`;
        document.getElementById('prof-sup-debt-amount').innerText = `Rp ${Number(s.debtAmount).toLocaleString('id-ID')}`;
        document.getElementById('prof-sup-trx-count').innerText = `${s.trxCount} kali`;
    };

    window.deleteActiveSupplier = () => {
        if (!activeSupplier) return;
        if (confirm(`Yakin ingin menghapus data supplier '${activeSupplier.name}'?`)) {
            window.suppliersList = window.suppliersList.filter(x => x.id !== activeSupplier.id);
            window.openSupplierTerkaitView();
        }
    };

    window.sendSupplierEmailAction = () => {
        if (activeSupplier && activeSupplier.email) window.location.href = `mailto:${activeSupplier.email}`;
    };
    window.callSupplierAction = () => {
        if (activeSupplier && activeSupplier.phone) window.location.href = `tel:+62${activeSupplier.phone}`;
    };
    window.smsSupplierAction = () => {
        if (activeSupplier && activeSupplier.phone) window.location.href = `sms:+62${activeSupplier.phone}`;
    };
    window.waSupplierAction = () => {
        if (activeSupplier && activeSupplier.phone) window.open(`https://wa.me/62${activeSupplier.phone}`, '_blank');
    };

    // --- EDIT SUPPLIER (SS 1000920223) ---
    window.openEditSupplierView = () => {
        if (!activeSupplier) return;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-edit-supplier').classList.remove('hidden');

        document.getElementById('edit-sup-name').value = activeSupplier.name || '';
        document.getElementById('edit-sup-email').value = activeSupplier.email || '';
        document.getElementById('edit-sup-phone').value = activeSupplier.phone || '';
        document.getElementById('edit-sup-address').value = activeSupplier.address || '';
    };

    window.closeEditSupplierView = () => {
        document.getElementById('view-edit-supplier').classList.add('hidden');
        document.getElementById('view-supplier-detail').classList.remove('hidden');
    };

    window.saveEditSupplierData = () => {
        if (!activeSupplier) return;
        const name = document.getElementById('edit-sup-name').value.trim();
        if (!name) return alert("Nama supplier wajib diisi!");

        activeSupplier.name = name;
        activeSupplier.email = document.getElementById('edit-sup-email').value.trim();
        activeSupplier.phone = document.getElementById('edit-sup-phone').value.trim();
        activeSupplier.address = document.getElementById('edit-sup-address').value.trim();

        alert("Data supplier berhasil disimpan!");
        window.closeEditSupplierView();
        window.openSupplierDetailView(activeSupplier.id);
    };

    // --- BUKU HUTANG SUPPLIER (SS 1000920224) ---
    window.openSupplierHutangView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-hutang').classList.remove('hidden');
        renderHutangSupplier();
    };

    window.closeSupplierHutangView = () => {
        document.getElementById('view-supplier-hutang').classList.add('hidden');
        document.getElementById('view-supplier-detail').classList.remove('hidden');
        window.openSupplierDetailView(activeSupplier.id);
    };

    function renderHutangSupplier() {
        document.getElementById('sup-hutang-title-name').innerText = activeSupplier.name;
        document.getElementById('sup-hutang-amount-disp').innerText = `Rp ${Number(activeSupplier.debtAmount || 0).toLocaleString('id-ID')}`;
        const debts = activeSupplier.debts || [];
        document.getElementById('sup-hutang-count-disp').innerText = debts.length;

        const container = document.getElementById('container-sup-debt-rows');
        container.innerHTML = '';

        debts.forEach(d => {
            container.innerHTML += `
                <div class="py-3.5 flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-3.5">
                        <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600">
                        <div class="space-y-0.5">
                            <span class="text-emerald-600 font-bold block">${d.date}</span>
                            <span class="text-gray-800 font-semibold block">Belum Dibayar</span>
                            <span class="text-gray-800 font-semibold block">Jatuh Tempo ${d.dueDate}</span>
                        </div>
                    </div>
                    <div class="text-right space-y-1">
                        <span class="inline-flex items-center text-gray-800 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-red-700 mr-1.5"></span>${d.status}</span>
                        <p class="font-bold text-gray-900">Rp ${Number(d.amount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    }

    window.promptBuatHutangSupplier = () => {
        const nominal = Number(prompt("Masukkan nominal hutang baru ke supplier (Rp):", "0")) || 0;
        if (nominal <= 0) return;
        if (!Array.isArray(activeSupplier.debts)) activeSupplier.debts = [];
        activeSupplier.debts.push({
            id: 'debt_' + Date.now(),
            date: "12/10/2026",
            dueDate: "2026/10/26",
            status: "Belum lunas",
            amount: nominal
        });
        activeSupplier.debtAmount = (Number(activeSupplier.debtAmount) || 0) + nominal;
        activeSupplier.debtCount = (Number(activeSupplier.debtCount) || 0) + 1;
        renderHutangSupplier();
    };

    window.lunasiSekaligusHutangSupplier = () => {
        if (!activeSupplier.debtAmount || activeSupplier.debtAmount <= 0) {
            return alert("Tidak ada sisa hutang ke supplier ini.");
        }
        if (confirm(`Lunasi seluruh sisa hutang ke ${activeSupplier.name} sebesar Rp ${Number(activeSupplier.debtAmount).toLocaleString('id-ID')}?`)) {
            activeSupplier.debts = [];
            activeSupplier.debtAmount = 0;
            renderHutangSupplier();
            alert("Seluruh hutang ke supplier berhasil dilunasi!");
        }
    };

    // --- LIST TRANSAKSI PEMBELIAN & STRUK PEMBELIAN STOK SUPPLIER (SS 1000920225 & 1000920226) ---
    window.openSupplierTransactionsView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-transactions').classList.remove('hidden');

        const container = document.getElementById('list-sup-trx-rows');
        container.innerHTML = '';

        window.supplierPurchaseHistory.forEach((trx, idx) => {
            container.innerHTML += `
                <div onclick="openSupplierReceiptView(${idx})" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-start space-x-5 flex-1 min-w-0 pr-2">
                        <div class="w-16 flex-shrink-0">
                            <span class="text-xs text-gray-800 font-semibold block">${trx.time}</span>
                            <div class="flex items-center space-x-1.5 mt-1">
                                <span class="text-2xl font-extrabold text-gray-900">${trx.day}</span>
                                <span class="text-[11px] text-gray-500 leading-tight block">${trx.monthYear.replace(' ', '<br>')}</span>
                            </div>
                        </div>
                        <div class="min-w-0 flex-1 text-xs space-y-0.5">
                            <p class="text-gray-500">Pengeluaran</p>
                            <p class="font-bold text-gray-900">Rp ${Number(trx.pengeluaran).toLocaleString('id-ID')}</p>
                            <p class="text-xs text-gray-600 font-medium pt-1 truncate">No. ${trx.id}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-3 flex-shrink-0">
                        <button onclick="event.stopPropagation(); deleteSupplierTrxRow(${idx})" class="text-red-500 hover:text-red-700 text-xl"><i class="fa-regular fa-trash-can"></i></button>
                        <div class="flex items-center space-x-3">
                            <i class="fa-solid fa-clone text-emerald-600 text-sm"></i>
                            <i class="fa-solid fa-arrow-right text-emerald-600 text-base"></i>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    window.closeSupplierTransactionsView = () => {
        document.getElementById('view-supplier-transactions').classList.add('hidden');
        document.getElementById('view-supplier-detail').classList.remove('hidden');
    };

    window.deleteSupplierTrxRow = (idx) => {
        const trx = window.supplierPurchaseHistory[idx];
        if (confirm(`Hapus catatan transaksi pembelian No. ${trx.id}?`)) {
            window.supplierPurchaseHistory.splice(idx, 1);
            window.openSupplierTransactionsView();
        }
    };

    window.openSupplierReceiptView = (idx = 0) => {
        const trx = window.supplierPurchaseHistory[idx] || window.supplierPurchaseHistory[0];
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-receipt').classList.remove('hidden');

        document.getElementById('sup-rec-id').innerText = trx.receiptId || "151374420261006153010";
        document.getElementById('sup-rec-date').innerText = trx.dateStr;
        document.getElementById('sup-rec-time').innerText = trx.time;
        document.getElementById('sup-rec-vendor').innerText = trx.vendorShort || "ALTAwrap P";
        document.getElementById('sup-rec-admin').innerText = trx.admin || "Adm";

        const itemsContainer = document.getElementById('sup-rec-items-container');
        itemsContainer.innerHTML = '';

        let subtotal = 0;
        (trx.items || []).forEach(item => {
            subtotal += item.total;
            itemsContainer.innerHTML += `
                <div>
                    <p class="font-bold text-gray-900">${item.name}</p>
                    <div class="flex justify-between text-gray-800 mt-0.5">
                        <span>${item.qty} ${item.unit} x Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                        <span>Rp ${Number(item.total).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('sup-rec-subtotal').innerText = `Rp ${Number(subtotal).toLocaleString('id-ID')}`;
        document.getElementById('sup-rec-total').innerText = `Rp ${Number(subtotal).toLocaleString('id-ID')}`;
        document.getElementById('sup-rec-paid').innerText = `Rp ${Number(subtotal).toLocaleString('id-ID')}`;
    };

    window.closeSupplierReceiptView = () => {
        document.getElementById('view-supplier-receipt').classList.add('hidden');
        document.getElementById('view-supplier-transactions').classList.remove('hidden');
    };

    window.sharePurchaseReceiptWA = () => {
        const id = document.getElementById('sup-rec-id').innerText;
        const tot = document.getElementById('sup-rec-total').innerText;
        const text = encodeURIComponent(`*STRUK PEMBELIAN STOK INTERNAL*\nNo: ${id}\nSupplier: ${activeSupplier.name}\nTotal: ${tot}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    // --- DIREKTORI PELANGGAN & SUPPLIER DARI SIDEBAR ---
    window.switchDirectoryTab = (tab) => {
        const btnP = document.getElementById('tab-dir-pelanggan');
        const btnS = document.getElementById('tab-dir-supplier');
        const list = document.getElementById('directory-main-list');
        list.innerHTML = '';

        if (tab === 'pelanggan') {
            btnP.className = "py-3.5 border-b-2 border-emerald-600 text-emerald-700";
            btnS.className = "py-3.5 border-b-2 border-transparent text-gray-500";
            window.customersList.forEach(c => {
                list.innerHTML += `
                    <div onclick="openedFromDirectory=true; openCustomerProfileView('${c.id}')" class="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">${c.avatarCode}</div>
                            <div>
                                <h4 class="font-bold text-xs text-gray-900">${c.name}</h4>
                                <p class="text-[11px] text-gray-500">${c.address || '-'}</p>
                            </div>
                        </div>
                        <span class="text-xs font-bold text-emerald-600">${c.points} Poin</span>
                    </div>
                `;
            });
        } else {
            btnS.className = "py-3.5 border-b-2 border-emerald-600 text-emerald-700";
            btnP.className = "py-3.5 border-b-2 border-transparent text-gray-500";
            window.suppliersList.forEach(s => {
                list.innerHTML += `
                    <div onclick="openedFromDirectory=true; openSupplierDetailView('${s.id}')" class="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                        <div class="flex items-center space-x-3.5">
                            <div class="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">${s.avatarCode}</div>
                            <div>
                                <h4 class="font-bold text-xs text-gray-900">${s.name}</h4>
                                <p class="text-[11px] text-gray-500">${s.email || '-'}</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                    </div>
                `;
            });
        }
    };

    // Inisialisasi tab awal direktori
    setTimeout(() => {
        if (document.getElementById('directory-main-list')) {
            window.switchDirectoryTab('pelanggan');
        }
    }, 300);
})();

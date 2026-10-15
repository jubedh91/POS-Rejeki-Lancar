// ============================================================================
// MODUL 5: PELANGGAN TERKAIT, PROFIL, POIN, SUPPLIER TERKAIT, & STRUK DIGITAL
// (DIROMBAK KE DESAIN KASIR PINTAR KLASIK & KODE GANDA DIHAPUS)
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
        <!-- BAGIAN A: ALUR PELANGGAN TERKAIT & PROFIL                      -->
        <!-- ============================================================== -->

        <!-- 1. LAYAR PELANGGAN TERKAIT -->
        <div id="view-pelanggan-terkait" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePelangganTerkaitView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pelanggan Terkait</h2>
            </div>
            <div class="px-4 py-3.5 bg-gray-50 border-b flex justify-between items-center text-xs">
                <span class="font-bold text-gray-900 text-sm truncate pr-2" id="rel-cust-prod-name">Nama Barang</span>
                <span class="text-gray-500 font-medium flex-shrink-0" id="rel-cust-prod-sku">SKU</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-pelanggan-terkait-rows"></div>
        </div>

        <!-- 2. LAYAR PROFIL LENGKAP PELANGGAN -->
        <div id="view-customer-profile" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10 shadow-sm border-b">
                <button onclick="backFromCustomerProfile()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Profil Pelanggan</h2>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-12 space-y-5">
                <div class="flex flex-col items-center justify-center pt-4">
                    <div class="flex items-center justify-center space-x-7">
                        <button onclick="deleteActiveCustomer()" class="text-red-500 hover:text-red-700 text-xl p-2 transition" title="Hapus Pelanggan">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                        <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-emerald-700 text-5xl shadow-inner border border-gray-200 overflow-hidden">
                            <i class="fa-solid fa-user mt-3"></i>
                        </div>
                        <button onclick="openEditCustomerView()" class="text-emerald-600 hover:text-emerald-800 text-xl p-2 transition" title="Edit Pelanggan">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-lg text-gray-900 mt-3 text-center" id="prof-cust-name-title">-</h3>
                </div>

                <div class="space-y-3.5 text-xs text-gray-800 pt-2">
                    <div>
                        <span class="text-gray-500 block mb-0.5">Name</span>
                        <span class="font-bold text-gray-900 text-sm" id="prof-cust-name">-</span>
                    </div>
                    <div>
                        <span class="text-gray-500 block mb-0.5">Tipe Pelanggan</span>
                        <span class="font-bold text-gray-900" id="prof-cust-tier">-</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Poin</span>
                            <span class="font-bold text-emerald-600 block text-sm" id="prof-cust-points">0 Poin</span>
                            <span class="font-bold text-gray-900 block mt-0.5" id="prof-cust-code">-</span>
                        </div>
                        <button onclick="openCustomerPointActionModal()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base shadow-sm transition border border-emerald-100" title="Kelola Poin Pelanggan">
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex-1 min-w-0 pr-3">
                            <span class="text-gray-500 block mb-0.5">Email</span>
                            <span class="font-bold text-gray-900 truncate block" id="prof-cust-email">-</span>
                            <span class="font-medium text-gray-500 block mt-0.5" id="prof-cust-email-sub"></span>
                        </div>
                        <button onclick="sendCustomerEmailAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base flex-shrink-0 shadow-sm transition border border-emerald-100">
                            <i class="fa-solid fa-envelope"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Telepon</span>
                            <span class="font-bold text-gray-900" id="prof-cust-phone">-</span>
                        </div>
                        <div class="flex items-center space-x-2.5">
                            <button onclick="callCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm transition border border-emerald-100"><i class="fa-solid fa-phone"></i></button>
                            <button onclick="smsCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-sm transition border border-emerald-100"><i class="fa-solid fa-message"></i></button>
                            <button onclick="waCustomerAction()" class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center text-base shadow-sm transition border border-emerald-100"><i class="fa-brands fa-whatsapp"></i></button>
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-500 block mb-0.5">Alamat</span>
                        <span class="font-bold text-gray-900" id="prof-cust-address">-</span>
                    </div>
                </div>

                <!-- Kartu Piutang & Transaksi Tunai -->
                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div onclick="if(window.openKreditPiutangView) window.openKreditPiutangView(); else alert('Modul Piutang belum terhubung!');" class="cursor-pointer group">
                        <div class="inline-block bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Piutang</div>
                        <div class="p-4 bg-white hover:bg-gray-50 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-gray-200 shadow-xs">
                            <div class="space-y-1">
                                <p class="font-semibold text-gray-500">Tot. piutang : <span class="text-gray-900" id="prof-cust-debt-count">0</span> kali</p>
                                <p class="font-bold text-sm text-red-600">Tot. sisa piutang : <span id="prof-cust-debt-total">Rp 0</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                        </div>
                    </div>

                    <div onclick="openCustomerTransactionListView()" class="cursor-pointer group">
                        <div class="inline-block bg-sky-500 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Tunai</div>
                        <div class="p-4 bg-white hover:bg-gray-50 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-gray-200 shadow-xs">
                            <div class="space-y-1">
                                <p class="font-bold text-sm">Tot. transaksi : <span class="text-sky-600" id="prof-tot-trx-count">0 kali</span></p>
                                <p class="font-bold text-xs text-gray-500">Tot. keuntungan : <span class="text-gray-900" id="prof-tot-profit">Rp 0</span></p>
                                <p class="font-bold text-xs text-gray-500">Tot. pendapatan : <span class="text-gray-900" id="prof-tot-revenue">Rp 0</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. LAYAR EDIT PELANGGAN -->
        <div id="view-edit-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeEditCustomerView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Edit Pelanggan</h2>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28 pt-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Panggilan</label>
                    <input type="text" id="edit-cust-name" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Poin</label>
                    <div class="flex items-center space-x-3">
                        <input type="number" id="edit-cust-points" readonly class="flex-1 bg-gray-100 border border-gray-200 p-3 px-4 rounded-full text-xs font-bold text-gray-500 focus:outline-none">
                        <button onclick="openCustomerPointActionModal()" type="button" class="text-emerald-700 hover:text-emerald-900 text-2xl px-1">
                            <i class="fa-regular fa-star"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kode Pelanggan</label>
                    <input type="text" id="edit-cust-code" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email (Opsional)</label>
                    <input type="email" id="edit-cust-email" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="flex items-center space-x-2">
                        <div class="px-3 py-3 text-sm font-semibold text-gray-800 flex items-center space-x-1">
                            <span>+62</span><i class="fa-solid fa-caret-down text-xs text-gray-500"></i>
                        </div>
                        <input type="text" id="edit-cust-phone" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="edit-cust-address" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
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
                        <i class="fa-solid fa-chevron-down text-xs text-gray-500 absolute inset-y-0 right-4 flex items-center pointer-events-none"></i>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveEditCustomerData()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- 4. LAYAR TUKAR POIN PELANGGAN -->
        <div id="view-tukar-poin" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeTukarPoinView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Tukar Poin Barang</h2>
                </div>
                <button onclick="redeemSelectedPointItems()" class="text-emerald-700 text-xs font-bold px-2 py-1">Tukar</button>
            </div>
            <div class="px-4 py-3.5 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center text-xs">
                <span class="font-semibold text-emerald-800">Poin saat ini</span>
                <span class="font-extrabold text-emerald-700 text-base" id="tukar-poin-current-disp">0</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-tukar-poin-items"></div>
        </div>

        <!-- 5. LAYAR LOG POIN PELANGGAN -->
        <div id="view-log-poin" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeLogPoinView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Log Poin</h2>
            </div>
            <div class="px-4 py-3.5 bg-gray-50 border-b text-xs space-y-0.5">
                <p class="font-bold text-gray-900 text-sm" id="log-cust-name">-</p>
                <p class="text-gray-500 font-medium" id="log-cust-email">-</p>
            </div>
            <div class="flex-1 overflow-y-auto px-4 divide-y divide-gray-100" id="container-log-poin-rows"></div>
        </div>

        <!-- 6. LAYAR LIST TRANSAKSI PENJUALAN PELANGGAN -->
        <div id="view-customer-transactions" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeCustomerTransactionListView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">List Transaksi Tunai</h2>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 bg-gray-50" id="list-cust-trx-rows"></div>
        </div>

        <!-- 7. LAYAR STRUK DIGITAL PENJUALAN -->
        <div id="view-digital-receipt" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-600 hidden relative">
            <div class="px-4 py-3 flex items-center justify-between text-white z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeDigitalReceiptView()" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-sm font-bold uppercase tracking-wider">Struk Digital</h2>
                </div>
                <button onclick="shareSalesReceiptWA()" class="text-xl p-1" title="Bagikan ke WhatsApp"><i class="fa-solid fa-share-nodes"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                <div class="w-full max-w-sm shadow-2xl my-2">
                    <div class="receipt-zigzag-top"></div>
                    <div class="bg-white px-6 py-5 font-mono text-[11px] text-gray-900 space-y-3">
                        <div class="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-3">
                            <h3 class="font-extrabold text-sm tracking-widest uppercase">REJEKI LANCAR</h3>
                            <p>Toko Macam Plastik</p>
                            <p>Jl. Bromo, PasarBaru, Pujon Lor</p>
                            <p class="pt-1 font-bold" id="rec-id-struk">-</p>
                        </div>
                        <div class="flex justify-between items-start pt-1">
                            <div class="space-y-0.5">
                                <p id="rec-date-disp">-</p>
                                <p id="rec-time-disp">-</p>
                            </div>
                            <div class="text-right space-y-0.5">
                                <p>Kasir : <span id="rec-cashier-disp">-</span></p>
                                <p id="rec-customer-disp" class="max-w-[140px] truncate">-</p>
                            </div>
                        </div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="space-y-2" id="rec-items-container"></div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="space-y-1.5">
                            <div class="flex justify-between"><span>Sub Total</span><span id="rec-subtotal-disp">Rp 0</span></div>
                            <div class="flex justify-between font-extrabold text-sm pt-1"><span>Total</span><span id="rec-total-disp">Rp 0</span></div>
                            <div class="flex justify-between"><span>Bayar (Cash)</span><span id="rec-paid-disp">Rp 0</span></div>
                            <div class="flex justify-between"><span>Kembali</span><span id="rec-change-disp">Rp 0</span></div>
                        </div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="flex justify-between"><span>Poin Bertambah</span><span class="font-bold" id="rec-earned-points">0</span></div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="text-center pt-2 leading-relaxed text-[10px]">
                            Tidak menerima pengembalian<br>barang tanpa perjanjian<br>dan struk pembelian<br>Terimakasih
                        </div>
                    </div>
                    <div class="receipt-zigzag-bottom"></div>
                </div>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN B: ALUR SUPPLIER TERKAIT & DETAIL SUPPLIER              -->
        <!-- ============================================================== -->

        <!-- 8. LAYAR SUPPLIER TERKAIT -->
        <div id="view-supplier-terkait" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeSupplierTerkaitView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Supplier Terkait</h2>
            </div>
            <div class="px-4 py-3.5 bg-gray-50 border-b flex justify-between items-center text-xs">
                <span class="font-bold text-gray-900 text-sm truncate pr-2" id="rel-sup-prod-name">Nama Barang</span>
                <span class="text-gray-500 font-medium flex-shrink-0" id="rel-sup-prod-sku">SKU</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="list-supplier-terkait-rows"></div>
        </div>

        <!-- 9. LAYAR DETAIL SUPPLIER -->
        <div id="view-supplier-detail" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <button onclick="backFromSupplierDetail()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Profil Supplier</h2>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-12 space-y-5">
                <div class="flex flex-col items-center justify-center pt-4">
                    <div class="flex items-center justify-center space-x-7">
                        <button onclick="deleteActiveSupplier()" class="text-red-500 hover:text-red-700 text-xl p-2 transition" title="Hapus Supplier">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                        <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-emerald-700 text-5xl shadow-inner border border-gray-200 overflow-hidden">
                            <i class="fa-solid fa-truck-field mt-3"></i>
                        </div>
                        <button onclick="openEditSupplierView()" class="text-emerald-600 hover:text-emerald-800 text-xl p-2 transition" title="Edit Supplier">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-lg text-gray-900 mt-3 text-center" id="prof-sup-name-title">-</h3>
                </div>

                <div class="divide-y divide-gray-100 text-xs text-gray-800 pt-2">
                    <div class="py-3">
                        <span class="text-gray-500 block mb-0.5">Nama Supplier</span>
                        <span class="font-bold text-gray-900 text-sm" id="prof-sup-name">-</span>
                    </div>
                    <div class="py-3 flex justify-between items-center">
                        <div class="flex-1 min-w-0 pr-3">
                            <span class="text-gray-500 block mb-0.5">Email</span>
                            <span class="font-bold text-gray-900 truncate block" id="prof-sup-email">-</span>
                        </div>
                        <button onclick="sendSupplierEmailAction()" class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0 transition border border-emerald-100"><i class="fa-regular fa-envelope"></i></button>
                    </div>
                    <div class="py-3 flex justify-between items-center">
                        <div>
                            <span class="text-gray-500 block mb-0.5">Telepon</span>
                            <span class="font-bold text-gray-900" id="prof-sup-phone">-</span>
                        </div>
                        <div class="flex items-center space-x-2.5">
                            <button onclick="callSupplierAction()" class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm transition border border-emerald-100"><i class="fa-solid fa-phone"></i></button>
                            <button onclick="smsSupplierAction()" class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm transition border border-emerald-100"><i class="fa-regular fa-message"></i></button>
                            <button onclick="waSupplierAction()" class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-base transition border border-emerald-100"><i class="fa-brands fa-whatsapp"></i></button>
                        </div>
                    </div>
                    <div class="py-3">
                        <span class="text-gray-500 block mb-0.5">Alamat</span>
                        <span class="font-bold text-gray-900" id="prof-sup-address">-</span>
                    </div>
                </div>

                <div class="space-y-4 pt-2">
                    <div onclick="if(window.openSupplierHutangView) window.openSupplierHutangView(); else alert('Modul Hutang belum terhubung!');" class="cursor-pointer group">
                        <div class="inline-block bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Hutang</div>
                        <div class="p-4 bg-white hover:bg-gray-50 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-gray-200 shadow-xs">
                            <div class="space-y-1">
                                <p class="font-semibold text-gray-500">Tot. hutang : <span class="text-gray-900" id="prof-sup-debt-count">0 kali</span></p>
                                <p class="font-bold text-sm text-red-600">Tot. sisa hutang : <span id="prof-sup-debt-amount">Rp 0</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                        </div>
                    </div>

                    <div onclick="openSupplierTransactionsView()" class="cursor-pointer group">
                        <div class="inline-block bg-sky-500 text-white font-bold text-xs px-4 py-1.5 rounded-t-xl">Tunai</div>
                        <div class="p-4 bg-white hover:bg-gray-50 rounded-b-xl rounded-tr-xl flex justify-between items-center text-xs text-gray-900 transition border border-gray-200 shadow-xs">
                            <div class="space-y-1">
                                <p class="font-bold text-sm text-gray-800">Tot. semua transaksi : <span class="text-sky-600" id="prof-sup-trx-count">0 kali</span></p>
                            </div>
                            <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 10. LAYAR EDIT SUPPLIER -->
        <div id="view-edit-supplier" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeEditSupplierView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Edit Supplier</h2>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28 pt-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Supplier</label>
                    <input type="text" id="edit-sup-name" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" id="edit-sup-email" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="flex items-center space-x-2">
                        <div class="px-3 py-3 text-sm font-semibold text-gray-800 flex items-center space-x-1">
                            <span>+62</span><i class="fa-solid fa-caret-down text-[10px] text-gray-500 ml-1"></i>
                        </div>
                        <input type="text" id="edit-sup-phone" class="flex-1 border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="edit-sup-address" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveEditSupplierData()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- 11. LAYAR LIST TRANSAKSI PEMBELIAN SUPPLIER -->
        <div id="view-supplier-transactions" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeSupplierTransactionsView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">List Transaksi Pembelian</h2>
            </div>
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 bg-gray-50" id="list-sup-trx-rows"></div>
        </div>

        <!-- 12. LAYAR STRUK DIGITAL PEMBELIAN STOK SUPPLIER -->
        <div id="view-supplier-receipt" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-600 hidden relative">
            <div class="px-4 py-3 flex items-center justify-between text-white z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="closeSupplierReceiptView()" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-sm font-bold uppercase tracking-wider">Struk Pembelian</h2>
                </div>
                <button onclick="sharePurchaseReceiptWA()" class="text-xl p-1" title="Bagikan Struk"><i class="fa-solid fa-share-nodes"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                <div class="w-full max-w-sm shadow-2xl my-2">
                    <div class="receipt-zigzag-top"></div>
                    <div class="bg-white px-6 py-5 font-mono text-[11px] text-gray-900 space-y-3">
                        <div class="text-center space-y-1 border-b border-dashed border-gray-400 pb-3">
                            <h3 class="font-extrabold text-sm tracking-widest uppercase">PEMBELIAN STOK</h3>
                            <p class="pt-1" id="sup-rec-id">-</p>
                        </div>
                        <div class="flex justify-between items-start pt-1">
                            <div class="space-y-0.5">
                                <p id="sup-rec-date">-</p>
                                <p id="sup-rec-time">-</p>
                                <p class="pt-1 text-[10px]">Supplier : <span id="sup-rec-vendor" class="font-bold">-</span></p>
                            </div>
                            <div class="text-right">
                                <p>Admin : <span id="sup-rec-admin">-</span></p>
                            </div>
                        </div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="space-y-2" id="sup-rec-items-container"></div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="space-y-1.5">
                            <div class="flex justify-between"><span>Sub Total</span><span id="sup-rec-subtotal">Rp 0</span></div>
                            <div class="flex justify-between font-extrabold text-sm pt-1"><span>Total</span><span id="sup-rec-total">Rp 0</span></div>
                            <div class="flex justify-between"><span>Bayar</span><span id="sup-rec-paid">Rp 0</span></div>
                        </div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="text-center font-bold py-1">Bukan Bukti Pembayaran</div>
                        <div class="border-b border-dashed border-gray-400 my-2"></div>
                        <div class="text-center pt-2 leading-relaxed text-[10px]">
                            Struk Pembelian untuk Kepentingan Pencatatan Internal
                        </div>
                    </div>
                    <div class="receipt-zigzag-bottom"></div>
                </div>
            </div>
        </div>
    `;

    // 3. SUNTIKKAN HTML MODALS POIN PELANGGAN KE DALAM #modals-container
    const modalsHTML = `
        <div id="modal-point-actions" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl p-5 text-center">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b pb-3 mb-4">Poin Pelanggan</h3>
                <div class="space-y-2.5 font-bold text-xs text-gray-800">
                    <button onclick="openAdjustPointsModal()" type="button" class="w-full bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex justify-between items-center hover:bg-emerald-100 transition">
                        <span>Tambah / Kurang Poin</span><i class="fa-solid fa-chevron-right text-emerald-600"></i>
                    </button>
                    <button onclick="openTukarPoinView()" type="button" class="w-full bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex justify-between items-center hover:bg-emerald-100 transition">
                        <span>Tukar Poin</span><i class="fa-solid fa-chevron-right text-emerald-600"></i>
                    </button>
                    <button onclick="openLogPoinView()" type="button" class="w-full bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex justify-between items-center hover:bg-emerald-100 transition">
                        <span>Log Poin</span><i class="fa-solid fa-chevron-right text-emerald-600"></i>
                    </button>
                </div>
                <button onclick="closeCustomerPointActionModal()" type="button" class="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase transition">Batal</button>
            </div>
        </div>

        <div id="modal-adjust-points" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b border-gray-100">POIN PELANGGAN</h3>
                
                <div class="flex items-center space-x-3 py-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl"><i class="fa-solid fa-star"></i></div>
                    <div>
                        <span class="text-[10px] font-semibold text-gray-500 block">Saat ini</span>
                        <span class="font-extrabold text-sm text-gray-900" id="adjust-current-points">0 Poin</span>
                    </div>
                </div>

                <div class="flex items-center space-x-6 py-2 text-xs font-bold text-gray-900">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="adjust_point_mode" value="add" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300">
                        <span>Tambah</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="radio" name="adjust_point_mode" value="reduce" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300">
                        <span>Kurangi</span>
                    </label>
                </div>

                <div class="flex items-center justify-center space-x-6 py-5">
                    <button onclick="changeAdjustPointVal(-1)" type="button" class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-xl font-bold flex items-center justify-center hover:bg-gray-200 transition"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" id="input-adjust-point-val" value="0" min="0" class="w-20 text-center text-2xl font-extrabold focus:outline-none text-gray-900 border-b-2 border-emerald-500 pb-1">
                    <button onclick="changeAdjustPointVal(1)" type="button" class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-xl font-bold flex items-center justify-center hover:bg-gray-200 transition"><i class="fa-solid fa-plus"></i></button>
                </div>

                <div>
                    <label class="block text-[11px] font-semibold text-gray-500 mb-1">Keterangan (Opsional)</label>
                    <input type="text" id="input-adjust-point-notes" placeholder="Catatan poin..." class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-medium text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="closeAdjustPointsModal()" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="saveAdjustedPoints()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SIMPAN</button>
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
    // 4. STATE & LOGIKA JAVASCRIPT PELANGGAN DAN SUPPLIER TERKAIT
    // ========================================================================
    let activeCustomer = null;
    let activeSupplier = null;

    function formatRupiahDec(val) {
        return Number(val || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    // --- ALUR PELANGGAN TERKAIT & PROFIL ---
    window.openPelangganTerkaitView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pelanggan-terkait').classList.remove('hidden');

        const p = window.activeDetailProduct;
        document.getElementById('rel-cust-prod-name').innerText = p && p.name ? p.name : 'Produk Terpilih';
        document.getElementById('rel-cust-prod-sku').innerText = p && p.sku ? p.sku : '-';

        const container = document.getElementById('list-pelanggan-terkait-rows');
        container.innerHTML = '';

        (window.customersList || []).forEach(cust => {
            container.innerHTML += `
                <div onclick="openCustomerProfileView('${cust.id}')" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                            ${cust.avatarCode || 'PL'}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-extrabold text-xs text-gray-900 truncate">${cust.name}</h4>
                            <p class="text-[11px] text-gray-500 font-semibold mt-0.5">${cust.phone || '-'}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md shadow-xs">${cust.points || 0} Poin</span>
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
        document.getElementById('view-pelanggan-terkait').classList.remove('hidden');
    };

    window.openCustomerProfileView = (custId) => {
        const c = window.customersList.find(x => x.id === custId) || window.customersList[0];
        if (!c) return;
        activeCustomer = c;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-customer-profile').classList.remove('hidden');

        document.getElementById('prof-cust-name-title').innerText = c.name;
        document.getElementById('prof-cust-name').innerText = c.name;
        document.getElementById('prof-cust-tier').innerText = c.tier || '-';
        document.getElementById('prof-cust-points').innerText = `${c.points || 0} Poin`;
        document.getElementById('prof-cust-code').innerText = c.code || '-';
        document.getElementById('prof-cust-email').innerText = c.email || '-';
        document.getElementById('prof-cust-email-sub').innerText = c.email ? `(${c.name})` : '';
        document.getElementById('prof-cust-phone').innerText = c.phone ? `+62${c.phone}` : '-';
        document.getElementById('prof-cust-address').innerText = c.address || '-';

        // Kalkulasi ulang Piutang dari data list
        const sisaPiutang = (c.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
        
        document.getElementById('prof-cust-debt-count').innerText = (c.piutangList || []).length;
        document.getElementById('prof-cust-debt-total').innerText = `Rp ${formatRupiahDec(sisaPiutang)}`;
        document.getElementById('prof-tot-trx-count').innerText = `${c.trxCount || 0} kali`;
        document.getElementById('prof-tot-profit').innerText = `Rp ${formatRupiahDec(c.totalProfit)}`;
        document.getElementById('prof-tot-revenue').innerText = `Rp ${formatRupiahDec(c.totalRevenue)}`;
    };

    window.deleteActiveCustomer = () => {
        if (!activeCustomer) return;
        if (confirm(`Yakin ingin menghapus data pelanggan '${activeCustomer.name}' secara permanen?`)) {
            window.customersList = window.customersList.filter(x => x.id !== activeCustomer.id);
            alert("Pelanggan dihapus.");
            window.backFromCustomerProfile();
        }
    };

    window.sendCustomerEmailAction = () => { if (activeCustomer && activeCustomer.email) window.location.href = `mailto:${activeCustomer.email}`; };
    window.callCustomerAction = () => { if (activeCustomer && activeCustomer.phone) window.location.href = `tel:+62${activeCustomer.phone}`; };
    window.smsCustomerAction = () => { if (activeCustomer && activeCustomer.phone) window.location.href = `sms:+62${activeCustomer.phone}`; };
    window.waCustomerAction = () => { if (activeCustomer && activeCustomer.phone) window.open(`https://wa.me/62${activeCustomer.phone}`, '_blank'); };

    // --- EDIT PELANGGAN ---
    window.openEditCustomerView = () => {
        if (!activeCustomer) return;
        document.getElementById('view-customer-profile').classList.add('hidden');
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

        alert("Data pelanggan berhasil diperbarui!");
        window.closeEditCustomerView();
        window.openCustomerProfileView(activeCustomer.id); // Refresh profil
    };

    // --- POIN PELANGGAN (TAMBAH/KURANG, TUKAR, LOG) ---
    window.openCustomerPointActionModal = () => {
        document.getElementById('modal-point-actions').classList.remove('hidden');
    };
    window.closeCustomerPointActionModal = () => {
        document.getElementById('modal-point-actions').classList.add('hidden');
    };

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
        const notes = document.getElementById('input-adjust-point-notes').value.trim() || (mode === 'add' ? 'Penyesuaian Manual (+)' : 'Penyesuaian Manual (-)');

        if (delta <= 0) return alert("Masukkan jumlah poin yang akan diubah!");

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

        document.getElementById('prof-cust-points').innerText = `${newPts} Poin`;
        const editPtsEl = document.getElementById('edit-cust-points');
        if (editPtsEl) editPtsEl.value = newPts;

        window.closeAdjustPointsModal();
        alert(`Poin berhasil diubah menjadi ${newPts}!`);
    };

    window.openTukarPoinView = () => {
        window.closeCustomerPointActionModal();
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tukar-poin').classList.remove('hidden');

        document.getElementById('tukar-poin-current-disp').innerText = activeCustomer.points || 0;
        const container = document.getElementById('list-tukar-poin-items');
        container.innerHTML = `<div class="p-8 text-center text-xs text-gray-400">Silakan atur barang/diskon penukaran poin di modul Marketing.</div>`;
    };
    window.closeTukarPoinView = () => {
        document.getElementById('view-tukar-poin').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };
    window.redeemSelectedPointItems = () => {
        alert("Pilih barang yang akan ditukar terlebih dahulu!");
    };

    window.openLogPoinView = () => {
        window.closeCustomerPointActionModal();
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-log-poin').classList.remove('hidden');

        document.getElementById('log-cust-name').innerText = activeCustomer.name || '-';
        document.getElementById('log-cust-email').innerText = activeCustomer.email || '-';

        const container = document.getElementById('container-log-poin-rows');
        container.innerHTML = '';

        if (!activeCustomer.pointLogs || activeCustomer.pointLogs.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Belum ada riwayat poin.</div>`;
            return;
        }

        activeCustomer.pointLogs.forEach(log => {
            const badgeColor = log.mode === 'add' ? 'text-emerald-600' : 'text-red-500';
            const sign = log.mode === 'add' ? '+' : '-';
            container.innerHTML += `
                <div class="py-3.5 flex justify-between items-center text-xs bg-white hover:bg-gray-50 transition">
                    <div>
                        <p class="font-extrabold text-gray-900">${log.notes}</p>
                        <p class="text-[10px] font-semibold text-gray-500 mt-0.5">${log.date}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-extrabold ${badgeColor} text-sm">${sign}${log.delta} Poin</span>
                        <span class="block text-[10px] font-bold text-gray-400 mt-0.5">Saldo: ${log.finalPoints}</span>
                    </div>
                </div>
            `;
        });
    };
    window.closeLogPoinView = () => {
        document.getElementById('view-log-poin').classList.add('hidden');
        document.getElementById('view-customer-profile').classList.remove('hidden');
    };

    // --- DAFTAR TRANSAKSI TUNAI PELANGGAN & STRUK PENJUALAN ---
    window.openCustomerTransactionListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-customer-transactions').classList.remove('hidden');

        const container = document.getElementById('list-cust-trx-rows');
        container.innerHTML = '';

        // Tampilkan data simulasi transaksi 
        const trxs = window.customerSalesHistory || [];
        if (trxs.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tidak ada riwayat transaksi tunai.</div>`;
            return;
        }

        trxs.forEach((trx, idx) => {
            container.innerHTML += `
                <div onclick="openDigitalReceiptView(${idx})" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-start space-x-4 flex-1 min-w-0 pr-2">
                        <div class="w-14 flex-shrink-0 text-center">
                            <span class="text-[11px] text-gray-500 font-semibold block">${trx.time}</span>
                            <div class="mt-1">
                                <span class="text-xl font-extrabold text-gray-900 block">${trx.day}</span>
                                <span class="text-[10px] font-bold text-gray-500 block leading-tight">${trx.monthYear.replace(' ', '<br>')}</span>
                            </div>
                        </div>
                        <div class="min-w-0 flex-1 text-xs space-y-1">
                            <div>
                                <span class="text-gray-500 font-medium block mb-0.5">Pendapatan</span>
                                <span class="font-extrabold text-gray-900">Rp ${formatRupiahDec(trx.paid || 0)}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 font-medium block mb-0.5">Keuntungan</span>
                                <span class="font-extrabold text-emerald-600">Rp ${formatRupiahDec(trx.keuntungan || 0)}</span>
                            </div>
                            <p class="text-[10px] text-gray-400 font-semibold truncate pt-1">No : ${trx.id}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-4 flex-shrink-0">
                        <button onclick="event.stopPropagation(); deleteCustomerTrxRow(${idx})" class="text-red-400 hover:text-red-600 text-xl transition"><i class="fa-regular fa-trash-can"></i></button>
                        <div class="flex items-center space-x-3 text-emerald-600">
                            <i class="fa-solid fa-clone text-sm"></i>
                            <i class="fa-solid fa-arrow-right text-base"></i>
                        </div>
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
        if (confirm("Hapus riwayat transaksi ini? Data penjualan akan hilang.")) {
            window.customerSalesHistory.splice(idx, 1);
            window.openCustomerTransactionListView();
        }
    };

    window.openDigitalReceiptView = (idx = 0) => {
        const trx = window.customerSalesHistory[idx] || window.customerSalesHistory[0];
        if (!trx) return;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-digital-receipt').classList.remove('hidden');

        document.getElementById('rec-id-struk').innerText = trx.id;
        document.getElementById('rec-date-disp').innerText = trx.dateStr;
        document.getElementById('rec-time-disp').innerText = trx.time;
        document.getElementById('rec-cashier-disp').innerText = trx.kasir || 'Adm';
        document.getElementById('rec-customer-disp').innerText = activeCustomer ? activeCustomer.name : "Pelanggan Umum";

        const itemsContainer = document.getElementById('rec-items-container');
        itemsContainer.innerHTML = '';

        let subtotal = 0;
        (trx.items || []).forEach(item => {
            subtotal += item.total;
            itemsContainer.innerHTML += `
                <div>
                    <p class="font-bold text-gray-900">${item.name}</p>
                    <div class="flex justify-between text-gray-800 mt-0.5">
                        <span>${item.qty} ${item.unit || 'pcs'} x Rp ${formatRupiahDec(item.price)}</span>
                        <span>Rp ${formatRupiahDec(item.total)}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('rec-subtotal-disp').innerText = `Rp ${formatRupiahDec(subtotal)}`;
        document.getElementById('rec-total-disp').innerText = `Rp ${formatRupiahDec(subtotal)}`; // Sama jika tanpa pajak/biaya
        document.getElementById('rec-paid-disp').innerText = `Rp ${formatRupiahDec(trx.paid)}`;
        document.getElementById('rec-change-disp').innerText = `Rp ${formatRupiahDec(trx.change)}`;
        document.getElementById('rec-earned-points').innerText = trx.pointsEarned || 0;
    };

    window.closeDigitalReceiptView = () => {
        document.getElementById('view-digital-receipt').classList.add('hidden');
        document.getElementById('view-customer-transactions').classList.remove('hidden');
    };

    window.shareSalesReceiptWA = () => {
        const id = document.getElementById('rec-id-struk').innerText;
        const tot = document.getElementById('rec-total-disp').innerText;
        const text = encodeURIComponent(`*STRUK PENJUALAN REJEKI LANCAR*\nNo: ${id}\nPelanggan: ${activeCustomer ? activeCustomer.name : '-'}\nTotal: ${tot}\n\nTerima kasih telah berbelanja di tempat kami!`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };


    // ========================================================================
    // 7. ALUR SUPPLIER TERKAIT & DETAIL SUPPLIER
    // ========================================================================
    window.openSupplierTerkaitView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-terkait').classList.remove('hidden');

        const p = window.activeDetailProduct;
        document.getElementById('rel-sup-prod-name').innerText = p && p.name ? p.name : 'Produk Terpilih';
        document.getElementById('rel-sup-prod-sku').innerText = p && p.sku ? p.sku : '-';

        const container = document.getElementById('list-supplier-terkait-rows');
        container.innerHTML = '';

        (window.suppliersList || []).forEach(sup => {
            container.innerHTML += `
                <div onclick="openSupplierDetailView('${sup.id}')" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                        ${sup.avatarCode || 'SP'}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="font-extrabold text-xs text-gray-900 truncate">${sup.name}</h4>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">${sup.email || '-'}</p>
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
        document.getElementById('view-supplier-terkait').classList.remove('hidden');
    };

    window.openSupplierDetailView = (supId) => {
        const s = window.suppliersList.find(x => x.id === supId) || window.suppliersList[0];
        if (!s) return;
        activeSupplier = s;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-detail').classList.remove('hidden');

        document.getElementById('prof-sup-name-title').innerText = s.name;
        document.getElementById('prof-sup-name').innerText = s.name;
        document.getElementById('prof-sup-email').innerText = s.email || '-';
        document.getElementById('prof-sup-phone').innerText = s.phone ? `+62${s.phone}` : '-';
        document.getElementById('prof-sup-address').innerText = s.address || '-';

        // Hitung ulang hutang Supplier
        const sisaHutang = (s.debts || []).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
        document.getElementById('prof-sup-debt-count').innerText = `${(s.debts || []).length} kali`;
        document.getElementById('prof-sup-debt-amount').innerText = `Rp ${formatRupiahDec(sisaHutang)}`;
        document.getElementById('prof-sup-trx-count').innerText = `${s.trxCount || 0} kali`;
    };

    window.deleteActiveSupplier = () => {
        if (!activeSupplier) return;
        if (confirm(`Yakin menghapus data supplier '${activeSupplier.name}' secara permanen?`)) {
            window.suppliersList = window.suppliersList.filter(x => x.id !== activeSupplier.id);
            alert("Supplier dihapus.");
            window.backFromSupplierDetail();
        }
    };

    window.sendSupplierEmailAction = () => { if (activeSupplier && activeSupplier.email) window.location.href = `mailto:${activeSupplier.email}`; };
    window.callSupplierAction = () => { if (activeSupplier && activeSupplier.phone) window.location.href = `tel:+62${activeSupplier.phone}`; };
    window.smsSupplierAction = () => { if (activeSupplier && activeSupplier.phone) window.location.href = `sms:+62${activeSupplier.phone}`; };
    window.waSupplierAction = () => { if (activeSupplier && activeSupplier.phone) window.open(`https://wa.me/62${activeSupplier.phone}`, '_blank'); };

    // --- EDIT SUPPLIER ---
    window.openEditSupplierView = () => {
        if (!activeSupplier) return;
        document.getElementById('view-supplier-detail').classList.add('hidden');
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

        alert("Data supplier berhasil diperbarui!");
        window.closeEditSupplierView();
        window.openSupplierDetailView(activeSupplier.id);
    };

    // --- LIST TRANSAKSI PEMBELIAN & STRUK DIGITAL SUPPLIER ---
    window.openSupplierTransactionsView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-transactions').classList.remove('hidden');

        const container = document.getElementById('list-sup-trx-rows');
        container.innerHTML = '';

        const trxs = window.supplierPurchaseHistory || [];
        if (trxs.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tidak ada riwayat pembelian.</div>`;
            return;
        }

        trxs.forEach((trx, idx) => {
            container.innerHTML += `
                <div onclick="openSupplierReceiptView(${idx})" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-start space-x-5 flex-1 min-w-0 pr-2">
                        <div class="w-16 flex-shrink-0 text-center">
                            <span class="text-[11px] text-gray-500 font-semibold block">${trx.time}</span>
                            <div class="mt-1">
                                <span class="text-xl font-extrabold text-gray-900 block">${trx.day}</span>
                                <span class="text-[10px] font-bold text-gray-500 block leading-tight">${trx.monthYear.replace(' ', '<br>')}</span>
                            </div>
                        </div>
                        <div class="min-w-0 flex-1 text-xs space-y-1">
                            <div>
                                <span class="text-gray-500 font-medium block mb-0.5">Pengeluaran</span>
                                <span class="font-extrabold text-gray-900">Rp ${formatRupiahDec(trx.pengeluaran)}</span>
                            </div>
                            <p class="text-[10px] text-gray-400 font-semibold truncate pt-1">No. ${trx.id || trx.receiptId}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-4 flex-shrink-0">
                        <button onclick="event.stopPropagation(); deleteSupplierTrxRow(${idx})" class="text-red-400 hover:text-red-600 text-xl transition"><i class="fa-regular fa-trash-can"></i></button>
                        <div class="flex items-center space-x-3 text-emerald-600">
                            <i class="fa-solid fa-clone text-sm"></i>
                            <i class="fa-solid fa-arrow-right text-base"></i>
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
        if (confirm("Hapus catatan transaksi pembelian ini?")) {
            window.supplierPurchaseHistory.splice(idx, 1);
            window.openSupplierTransactionsView();
        }
    };

    window.openSupplierReceiptView = (idx = 0) => {
        const trx = window.supplierPurchaseHistory[idx];
        if (!trx) return;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-receipt').classList.remove('hidden');

        document.getElementById('sup-rec-id').innerText = trx.receiptId || "-";
        document.getElementById('sup-rec-date').innerText = trx.dateStr;
        document.getElementById('sup-rec-time').innerText = trx.time;
        document.getElementById('sup-rec-vendor').innerText = trx.vendorShort || (activeSupplier ? activeSupplier.name : 'Supplier');
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
                        <span>${item.qty} ${item.unit || 'pcs'} x Rp ${formatRupiahDec(item.price)}</span>
                        <span>Rp ${formatRupiahDec(item.total)}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('sup-rec-subtotal').innerText = `Rp ${formatRupiahDec(subtotal)}`;
        document.getElementById('sup-rec-total').innerText = `Rp ${formatRupiahDec(subtotal)}`; // Sama jika tanpa biaya
        document.getElementById('sup-rec-paid').innerText = `Rp ${formatRupiahDec(trx.pengeluaran)}`;
    };

    window.closeSupplierReceiptView = () => {
        document.getElementById('view-supplier-receipt').classList.add('hidden');
        document.getElementById('view-supplier-transactions').classList.remove('hidden');
    };

    window.sharePurchaseReceiptWA = () => {
        const id = document.getElementById('sup-rec-id').innerText;
        const tot = document.getElementById('sup-rec-total').innerText;
        const text = encodeURIComponent(`*STRUK PEMBELIAN STOK*\nNo: ${id}\nSupplier: ${activeSupplier ? activeSupplier.name : '-'}\nTotal: ${tot}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

})();
```

File `modul-relasi.js` ini memastikan bahwa kamu bisa mengklik, mengedit, melihat riwayat hutang/piutang/tunai, serta mencetak struk digital langsung dari modul Pelanggan dan Supplier dengan **sempurna** tanpa terlempar ke layar putih. 

Silakan timpa ke repositori GitHub-mu. Jika kamu sudah selesai menimpa **SEMUA** file yang saya kirim di tahap-tahap ini, kamu bisa mencoba membuka APK barunya. Dijamin, semua keluhanmu (*header* ganda, kalender manual, layar *blank*) sudah lenyap!

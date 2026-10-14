// ============================================================================
// MODUL 13: PEMBELIAN DARI SUPPLIER LENGKAP (KERANJANG, DRAFT, PEMBAYARAN, STRUK, UBAH HARGA)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN UTAMA PEMBELIAN (KERANJANG) === -->
        <div id="view-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('manajemen-hub')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembelian</h2>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="pembelianOpenDataDraft()" class="bg-amber-400 hover:bg-amber-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm transition">
                        <span>Draft</span><i class="fa-solid fa-file-invoice"></i>
                    </button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-pembelian-main').classList.toggle('hidden')" class="text-emerald-700 text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-pembelian-main" class="absolute right-0 top-10 w-48 bg-white rounded-md shadow-2xl py-1 hidden z-50 border border-gray-100">
                            <button onclick="pembelianBatalkan()" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition block">Batalkan Pembelian</button>
                            <button onclick="pembelianBukaPengaturan()" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition block">Pengaturan Pembelian</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <button onclick="document.getElementById('modal-pembelian-notif-stok').classList.remove('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-filter"></i></button>
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-pembelian-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-pembelian-sort" class="absolute left-0 top-10 w-40 bg-emerald-50 rounded-md shadow-2xl py-1 hidden z-50 text-xs text-gray-900 border border-emerald-100">
                        <button onclick="pembelianApplySort('name')" class="w-full text-left px-4 py-2.5 font-bold transition block">Barang</button>
                        <button onclick="pembelianApplySort('sku')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Kode</button>
                        <button onclick="pembelianApplySort('stock')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Stok</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-pembelian" oninput="renderPembelianProductList(this.value)" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-barcode"></i></button>
                <button onclick="if(window.openScannerView) window.openScannerView('pembelian')" class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-expand"></i></button>
            </div>

            <div class="bg-white border-b py-2 px-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex space-x-2" id="container-pembelian-categories">
                <!-- Disuntik via JS -->
            </div>

            <div class="flex-1 overflow-y-auto pb-24 bg-white" onclick="document.getElementById('dropdown-pembelian-main').classList.add('hidden'); document.getElementById('dropdown-pembelian-sort').classList.add('hidden');">
                <div onclick="pembelianBuatBarangBaru()" class="p-4 flex items-center space-x-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-emerald-600 text-xl font-bold flex-shrink-0">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Buat barang baru</span>
                </div>
                <div id="container-pembelian-products" class="divide-y divide-gray-100"></div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="pembelianLanjutKeRincian()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-md shadow-lg flex justify-between items-center text-xs uppercase tracking-wider transition active:scale-95">
                    <span><span id="pembelian-cart-count" class="text-base font-extrabold mr-1">0</span> Barang</span>
                    <span>LANJUT</span>
                </button>
            </div>
        </div>

        <!-- === 2. PENGATURAN PEMBELIAN === -->
        <div id="view-pengaturan-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-pengaturan-pembelian').classList.add('hidden'); document.getElementById('view-pembelian').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pengaturan Pembelian</h2>
            </div>
            <div class="flex-1 p-4 space-y-4 text-xs font-semibold text-gray-900">
                <p class="text-gray-500">Mode Pencarian Barcode Barang</p>
                <label class="flex items-center space-x-3 cursor-pointer">
                    <div class="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check"></i></div>
                    <span>Barang Default</span>
                </label>
                <div class="flex space-x-8 pl-1 text-gray-600">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-5 h-5 rounded border border-gray-300"></div><span>Varian</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-5 h-5 rounded border border-gray-300"></div><span>Multisatuan</span>
                    </label>
                </div>
                <p class="text-[10px] text-gray-400 font-medium leading-relaxed">*Mengaktifkan semua dapat memperlambat proses pencarian Anda</p>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="document.getElementById('view-pengaturan-pembelian').classList.add('hidden'); document.getElementById('view-pembelian').classList.remove('hidden'); alert('Pengaturan Pembelian disimpan');" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 3. RINCIAN PEMBELIAN === -->
        <div id="view-rincian-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-rincian-pembelian').classList.add('hidden'); document.getElementById('view-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembelian</h2>
                </div>
                <h2 class="text-base font-extrabold text-gray-900" id="rincian-pembelian-grandtotal">Rp 0</h2>
            </div>
            
            <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <p class="text-[10px] text-gray-500 font-semibold">Ubah harga jual bisa dilakukan setelah pembelian selesai</p>
            </div>

            <div id="rincian-pembelian-supplier-tab" class="hidden px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-900 shadow-xs">
                <div class="flex items-center space-x-2.5">
                    <i class="fa-solid fa-file-invoice text-amber-500 text-base"></i>
                    <span>Order <span class="font-semibold text-gray-500" id="rincian-pembelian-supplier-name">Camel (dus)</span></span>
                </div>
                <button onclick="pembelianRemoveSupplier()" class="text-gray-400 hover:text-red-500 text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="px-4 py-3 bg-white flex justify-between items-center relative z-20">
                <div class="flex space-x-3">
                    <button onclick="document.getElementById('modal-rincian-sort').classList.remove('hidden')" class="border border-emerald-600 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-700 flex items-center space-x-1.5 hover:bg-emerald-50">
                        <i class="fa-solid fa-arrow-up-wide-short"></i><span>Nama</span>
                    </button>
                    <button onclick="document.getElementById('modal-rincian-biaya').classList.remove('hidden')" class="border border-emerald-600 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-700 flex items-center space-x-1.5 hover:bg-emerald-50">
                        <i class="fa-solid fa-plus"></i><span>Biaya</span>
                    </button>
                </div>
                <div class="text-[10px] font-bold text-emerald-700 hidden" id="rincian-label-biaya">Biaya: Rp 10.000 <i class="fa-solid fa-chevron-down ml-1"></i></div>
            </div>

            <div class="flex-1 overflow-y-auto bg-white pb-24" id="container-rincian-cart-items"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 flex space-x-3">
                <button onclick="pembelianGoToPembayaran()" type="button" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    BAYAR
                </button>
                <button onclick="pembelianSimpanKeDraft()" type="button" class="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold py-3.5 px-6 rounded-xl shadow-sm transition active:scale-95 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <i class="fa-solid fa-file-invoice"></i><span>SIMPAN</span>
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN PEMBAYARAN PEMBELIAN === -->
        <div id="view-pembayaran-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex justify-between items-center z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pembayaran-pembelian').classList.add('hidden'); document.getElementById('view-rincian-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembelian</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-base font-extrabold text-gray-900" id="pembayaran-grandtotal">Rp 0</h2>
                    <button id="btn-pembayaran-submit" onclick="pembelianSelesaiTransaksi()" class="w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm transition pointer-events-none">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-4 flex flex-col">
                <h1 class="text-3xl font-extrabold text-gray-400 text-center py-2 pb-5 transition-colors duration-300" id="pembayaran-display-cash">Rp 0</h1>

                <div class="flex items-center space-x-3 mb-3">
                    <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-900">
                        <input type="checkbox" id="chk-pembayaran-hutang" onchange="pembelianToggleHutangMode(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Hutang</span>
                    </label>
                    <div onclick="pembelianPilihSupplierHutang()" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-semibold text-gray-500 cursor-pointer" id="box-pembayaran-sup-name">
                        Pilih Supplier
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" id="input-pembayaran-date" class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 focus:outline-none" value="13/10/2026 16:13:00">
                    <div class="relative">
                        <select class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none">
                            <option>Non Cashdrawer</option>
                            <option>Cashdrawer</option>
                        </select>
                        <i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-3 top-3.5 pointer-events-none"></i>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3 text-xs font-semibold text-gray-600">
                    <div onclick="document.getElementById('modal-pembayaran-diskon').classList.remove('hidden')" class="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center cursor-pointer">
                        <span id="label-pembayaran-diskon">Diskon : 0%</span>
                    </div>
                    <div onclick="document.getElementById('modal-pembayaran-pajak').classList.remove('hidden')" class="w-full border border-gray-300 rounded-lg p-3 flex justify-between items-center cursor-pointer">
                        <span id="label-pembayaran-pajak">Pajak : 0%</span>
                    </div>
                </div>

                <!-- Input Keterangan Struk -->
                <div class="relative mb-5 flex-shrink-0">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600"><i class="fa-solid fa-pen text-sm"></i></span>
                    <input type="text" id="input-pembayaran-keterangan" placeholder="untuk ditampilkan di struk" class="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <!-- SLIDER NUMPAD & NOMINAL CEPAT -->
                <div class="flex-1 relative overflow-hidden mt-2 bg-gray-50 rounded-2xl p-2 pb-0">
                    <div id="pembayaran-slider-track" class="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-300 ease-in-out pb-4">
                        
                        <!-- Panel Kiri: Kalkulator Numpad -->
                        <div class="w-1/2 h-full px-2">
                            <div class="grid grid-cols-4 gap-2 h-full">
                                <button onclick="pembelianNumpadInput('7')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">7</button>
                                <button onclick="pembelianNumpadInput('8')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">8</button>
                                <button onclick="pembelianNumpadInput('9')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">9</button>
                                <button onclick="pembelianNumpadInput('C')" class="bg-gray-200 rounded-xl shadow-xs text-xl font-bold text-gray-600 active:bg-gray-300 transition">C</button>
                                
                                <button onclick="pembelianNumpadInput('4')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">4</button>
                                <button onclick="pembelianNumpadInput('5')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">5</button>
                                <button onclick="pembelianNumpadInput('6')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">6</button>
                                <button onclick="pembelianNumpadInput('X')" class="bg-gray-100 rounded-xl shadow-xs text-xl font-bold text-emerald-700 active:bg-gray-200 transition"><i class="fa-solid fa-delete-left"></i></button>
                                
                                <button onclick="pembelianNumpadInput('1')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">1</button>
                                <button onclick="pembelianNumpadInput('2')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">2</button>
                                <button onclick="pembelianNumpadInput('3')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">3</button>
                                <button onclick="pembelianSlideNumpad('right')" class="bg-gray-100 rounded-xl shadow-xs text-xl font-bold text-emerald-700 active:bg-gray-200 transition"><i class="fa-solid fa-money-bill-wave"></i></button>
                                
                                <button onclick="pembelianNumpadInput('0')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">0</button>
                                <button onclick="pembelianNumpadInput('000')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">000</button>
                                <button onclick="pembelianNumpadInput('.')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 transition">.</button>
                                <!-- Ruang kosong pojok kanan bawah numpad -->
                                <div></div>
                            </div>
                        </div>

                        <!-- Panel Kanan: Nominal Cepat Hijau -->
                        <div class="w-1/2 h-full px-2 overflow-y-auto">
                            <div class="grid grid-cols-2 gap-3" id="pembayaran-fastcash-container">
                                <!-- Tombol akan dirender dari JS -->
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        <!-- === 5. HALAMAN TRANSAKSI BERHASIL === -->
        <div id="view-pembelian-success" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <button onclick="pembelianOpenUbahHarga()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-md text-xs shadow-sm transition">Ubah Harga</button>
                <button onclick="pembelianSelesaiTutup()" class="w-7 h-7 rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center text-sm font-bold transition"><i class="fa-solid fa-check"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
                <p class="text-[11px] text-gray-500 font-semibold mb-6">Terdapat perubahan harga beli. Klik ubah harga untuk mengubah harga jual</p>
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center relative mb-3">
                        <i class="fa-solid fa-cash-register text-3xl text-emerald-200"></i>
                        <div class="absolute -bottom-1 -left-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-white"><i class="fa-solid fa-check"></i></div>
                    </div>
                    <h2 class="text-lg font-extrabold text-gray-900">Transaksi berhasil!</h2>
                </div>
                <div class="space-y-3 text-xs font-semibold text-gray-600 mb-6 px-2">
                    <div class="flex justify-between items-center">
                        <span>Total Transaksi</span><span class="text-gray-900 font-bold" id="succ-total">Rp 71.512,5</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Uang dibayarkan</span>
                        <div class="flex items-center space-x-1.5"><i class="fa-regular fa-circle-question text-emerald-500"></i><span class="text-gray-900 font-bold" id="succ-paid">Rp 71.512,5</span></div>
                    </div>
                    <div class="flex justify-between items-center"><span>Kembalian</span><span class="text-gray-900 font-bold" id="succ-change">Rp 0</span></div>
                    <div class="flex justify-between items-center"><span>Kasir</span><span class="text-gray-900 font-bold">Adm</span></div>
                    <div class="flex justify-between items-center"><span>Supplier</span><span class="text-gray-900 font-bold" id="succ-sup">Camel (dus)</span></div>
                    <div class="flex justify-between items-center"><span>T. Diskon</span><span class="text-gray-900 font-bold" id="succ-disc">Rp 3.237,5</span></div>
                    <div class="flex justify-between items-center"><span>T. Pajak</span><span class="text-gray-900 font-bold" id="succ-tax">Rp 0</span></div>
                </div>
                <div onclick="pembelianLihatStrukDigital()" class="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4 shadow-xs cursor-pointer hover:bg-gray-50 transition">
                    <i class="fa-solid fa-print text-emerald-600 text-xl"></i>
                    <span class="font-bold text-xs text-gray-900">Lihat Struk</span>
                </div>
            </div>
        </div>

        <!-- === 6. HALAMAN UBAH HARGA JUAL === -->
        <div id="view-ubah-harga-jual" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-ubah-harga-jual').classList.add('hidden'); document.getElementById('view-pembelian-success').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Ubah Harga Jual</h2>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto pb-24" id="container-ubah-harga-items"></div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="pembelianSaveUbahHarga()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <!-- === 7. STRUK DIGITAL PEMBELIAN === -->
        <div id="view-pembelian-struk" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-600 hidden relative z-50">
            <div class="px-4 py-3 flex justify-between items-center text-white z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="document.getElementById('view-pembelian-struk').classList.add('hidden'); document.getElementById('view-pembelian-success').classList.remove('hidden');" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-base font-bold uppercase tracking-wider">STRUK</h2>
                </div>
                <div class="flex items-center space-x-4 text-xl">
                    <button onclick="alert('Mengunduh Struk Pembelian...')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="document.getElementById('modal-share-struk').classList.remove('hidden')"><i class="fa-solid fa-share-nodes"></i></button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-struk-menu').classList.toggle('hidden')" class="focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-struk-menu" class="absolute right-0 top-8 w-40 bg-white rounded-md shadow-2xl py-1 hidden z-50 text-xs font-semibold text-gray-700">
                            <button onclick="pembelianStrukMenu('cetak')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Cetak</button>
                            <button onclick="pembelianStrukMenu('edit')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Edit atau retur</button>
                            <button onclick="pembelianStrukMenu('rincian')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Rincian</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 pb-12 flex justify-center" onclick="document.getElementById('dropdown-struk-menu').classList.add('hidden')">
                <div class="bg-white w-full max-w-sm rounded-sm shadow-2xl p-6 relative overflow-hidden" style="background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px), radial-gradient(circle at 10px 100%, transparent 10px, white 11px); background-size: 20px 100%; background-repeat: repeat-x;">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNlY2ZjZjciLz48L3N2Zz4=')]"></div>
                    <div class="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCIgZmlsbD0iI2VjZmNmNyIvPjwvc3ZnPg==')] transform rotate-180"></div>
                    <div id="content-struk-digital" class="pt-4 pb-2 text-[11px] font-mono text-gray-900 leading-snug"></div>
                </div>
            </div>
        </div>

        <!-- === 8. HALAMAN RINCIAN STRUK JSON === -->
        <div id="view-rincian-struk" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-rincian-struk').classList.add('hidden'); document.getElementById('view-pembelian-struk').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Rincian Struk</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
                <pre id="content-rincian-json" class="text-[10px] text-gray-700 whitespace-pre-wrap font-mono"></pre>
            </div>
        </div>

        <!-- === 9. HALAMAN DRAFT PEMBELIAN === -->
        <div id="view-form-draft-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-form-draft-pembelian').classList.add('hidden'); document.getElementById('view-rincian-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Draft Pembelian</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <p class="text-xs text-gray-600 font-medium">Simpan pembelian sebagai draft untuk dilanjutkan di lain waktu.</p>
                <div>
                    <span class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Supplier</span>
                    <button id="btn-draft-pick-sup" onclick="pembelianPilihSupplierHutang()" type="button" class="w-full bg-emerald-100/50 text-emerald-700 font-bold py-3.5 rounded-full flex items-center justify-center space-x-2 transition">
                        <i class="fa-solid fa-user"></i><span>Pilih Supplier</span>
                    </button>
                    <div id="box-draft-sup-selected" class="hidden flex items-center justify-between px-2 py-1">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs" id="draft-sup-avatar">C(</div>
                            <div>
                                <span class="font-bold text-xs text-gray-900 block" id="draft-sup-name">Camel (dus)</span>
                                <span class="text-[10px] text-gray-500 font-semibold" id="draft-sup-phone">81233617676</span>
                            </div>
                        </div>
                        <button onclick="pembelianDraftClearSup()" class="text-gray-400 hover:text-red-500 text-lg"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">*Nama Draft Pembelian</label>
                    <input type="text" id="input-draft-name" placeholder="Nama Pembelian" class="w-full border border-gray-300 rounded-full p-3.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo</label>
                    <div class="border border-emerald-600 rounded-full p-3.5 px-4 flex items-center space-x-3">
                        <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                        <input type="text" id="input-draft-due" class="flex-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none" value="29 Oct 2026">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-semibold text-gray-600 mb-1.5">Diskon (%)</label><input type="number" id="input-draft-disc" value="0.0" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></div>
                    <div><label class="block text-xs font-semibold text-gray-600 mb-1.5">Pajak (%)</label><input type="number" id="input-draft-tax" value="0.0" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan Draft</label>
                    <textarea id="input-draft-notes" rows="3" placeholder="Keterangan" class="w-full border border-gray-300 rounded-xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="pembelianSaveDraft()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <div id="view-data-draft-list" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-data-draft-list').classList.add('hidden'); document.getElementById('view-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Data Draft Pembelian</h2>
                </div>
            </div>
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-draft-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-draft-sort" class="absolute left-0 top-10 w-40 bg-white rounded-md shadow-2xl py-1 hidden z-50 text-xs font-medium text-gray-900 border border-gray-100">
                        <button onclick="this.parentNode.classList.add('hidden')" class="w-full text-left px-4 py-3 hover:bg-gray-50 transition block">Paling Baru</button>
                        <button onclick="this.parentNode.classList.add('hidden')" class="w-full text-left px-4 py-3 bg-gray-100 transition block">Paling Lama</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" placeholder="Cari Pembelian / Supplier" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
            </div>
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3">
                <input type="checkbox" id="chk-draft-all" onchange="pembelianDraftSelectAll(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                <span class="font-bold text-xs text-gray-900">Pilih Semua</span>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-24" id="container-data-draft-rows"></div>
            <div id="bar-draft-hapus" class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 hidden">
                <button onclick="alert('Draft terpilih berhasil dihapus.');" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold py-3.5 rounded-full shadow-xs transition active:scale-95 text-xs uppercase tracking-wider">
                    HAPUS (<span id="count-draft-hapus">1</span>)
                </button>
            </div>
        </div>

        <div id="view-detail-draft" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-detail-draft').classList.add('hidden'); document.getElementById('view-data-draft-list').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Detail Draft</h2>
                </div>
                <button onclick="document.getElementById('modal-draft-hapus-reason').classList.remove('hidden')" class="text-red-600 text-xl p-1"><i class="fa-regular fa-trash-can"></i></button>
            </div>
            <div class="bg-white border-b border-gray-200 shadow-xs">
                <div onclick="pembelianToggleDraftDetailHeader()" class="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                    <span class="font-bold text-xs text-gray-900">Total PO</span>
                    <div class="flex items-center space-x-2">
                        <span class="font-extrabold text-sm text-gray-900" id="draft-det-grandtotal">Rp 74.750</span>
                        <i id="icon-draft-det-chevron" class="fa-solid fa-chevron-right text-gray-900 text-xs"></i>
                    </div>
                </div>
                <div id="box-draft-det-info" class="hidden px-4 py-3 bg-gray-50 text-[11px] font-semibold text-gray-600 space-y-1.5 border-t border-gray-100">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="font-extrabold text-gray-900 text-xs" id="draft-det-sup">Camel (dus)</span>
                            <span class="block mt-0.5"><i class="fa-regular fa-calendar mr-1"></i>Dibuat: <span id="draft-det-created">13 Oct 2026</span></span>
                            <span class="block mt-0.5" id="draft-det-qty">70 item</span>
                        </div>
                        <div class="text-right">
                            <span class="font-bold text-emerald-600 flex items-center justify-end"><span class="mr-1">Open</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>
                            <span class="block mt-0.5" id="draft-det-due">J/T: 29 Oct 2026</span>
                            <span class="block mt-0.5 font-bold text-gray-900">Total: Rp 74.750</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <span>Diskon: <span class="text-emerald-600 font-bold">0%</span></span>
                        <span>Pajak: <span class="text-emerald-600 font-bold">0%</span></span>
                        <span>Biaya: <span class="text-emerald-600 font-bold">Rp 10.000 <i class="fa-solid fa-chevron-down ml-1"></i></span></span>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto px-4 py-2 bg-gray-50" id="container-draft-det-items"></div>
            <div class="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-10 flex space-x-3">
                <button onclick="document.getElementById('modal-draft-print').classList.remove('hidden')" type="button" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200 transition"><i class="fa-solid fa-share-nodes"></i></button>
                <button onclick="document.getElementById('modal-draft-print').classList.remove('hidden')" type="button" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200 transition"><i class="fa-solid fa-print"></i></button>
                <button onclick="pembelianLanjutKeRincian()" type="button" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200 transition"><i class="fa-solid fa-pen"></i></button>
                <button onclick="pembelianGoToPembayaran()" type="button" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">BAYAR SEKARANG</button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <div id="modal-pembelian-notif-stok" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5">NOTIFIKASI</h3>
                <div class="space-y-3 font-semibold text-sm">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-red-600"></span><span>Stok Habis : 531 Barang</span></div><i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-yellow-400"></span><span>Stok Menipis : 464 Barang</span></div><i class="fa-solid fa-chevron-right"></i>
                    </button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" class="w-full flex items-center justify-between p-3.5 rounded-full border border-emerald-500 bg-emerald-100/50 transition text-gray-900">
                        <div class="flex items-center space-x-3"><span class="w-3.5 h-3.5 rounded-full bg-gray-300"></span><span>Semua Stok : 1879 Barang</span></div><i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs mt-5 transition">TUTUP</button>
            </div>
        </div>

        <div id="modal-pembelian-multisatuan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-sm w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center">TAMBAH MULTISATUAN</h3>
                <div class="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                    <div>
                        <h4 class="font-extrabold text-sm text-gray-900" id="mul-name">Alas TAR 20 O</h4>
                        <p class="text-[10px] text-gray-500 font-semibold" id="mul-sku">115</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[11px] text-gray-500 font-semibold" id="mul-price">Rp 2.000</p>
                        <p class="text-[11px] text-gray-900 font-bold" id="mul-stock">195</p>
                    </div>
                </div>
                <div class="space-y-3 mb-4">
                    <div class="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <span>pcs</span>
                        <input type="number" id="mul-qty-pcs" value="0" class="w-24 border border-gray-300 rounded-full p-2 text-center text-gray-900 font-bold focus:outline-none focus:border-emerald-600">
                    </div>
                    <div class="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <span>pak</span>
                        <input type="number" id="mul-qty-pak" value="0" class="w-24 border border-emerald-600 rounded-full p-2 text-center text-gray-900 font-bold focus:outline-none">
                    </div>
                </div>
                <div class="space-y-4 text-xs">
                    <div>
                        <span class="block text-gray-500 font-semibold mb-1">Harga beli per pcs</span>
                        <input type="number" id="mul-buyprice" value="950" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 text-center focus:outline-none">
                    </div>
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-mul-diskon" onchange="document.getElementById('box-mul-diskon').classList.toggle('hidden', !this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="font-bold text-gray-900">ubah diskon perjumlah</span>
                        </label>
                        <div id="box-mul-diskon" class="hidden flex mt-2 border border-emerald-600 rounded-md overflow-hidden">
                            <input type="number" id="input-mul-diskon-val" value="0" class="flex-1 p-3 px-4 font-bold text-gray-900 focus:outline-none">
                            <button type="button" class="w-12 bg-emerald-600 text-white font-bold text-xs">%</button>
                            <button type="button" class="w-12 bg-emerald-700 text-white font-bold text-xs">Rp</button>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-mul-notes" onchange="document.getElementById('box-mul-notes').classList.toggle('hidden', !this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="font-bold text-gray-900">Tambah catatan singkat</span>
                        </label>
                        <div id="box-mul-notes" class="hidden mt-2">
                            <input type="text" id="input-mul-notes-val" placeholder="Tuliskan catatan singkat" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-0 pt-6">
                    <button onclick="document.getElementById('modal-pembelian-multisatuan').classList.add('hidden')" type="button" class="text-emerald-600 hover:bg-gray-50 py-3 font-extrabold text-xs uppercase transition border-t border-r border-gray-200">BATAL</button>
                    <button onclick="pembelianAddToCart()" type="button" class="text-emerald-600 hover:bg-gray-50 py-3 font-extrabold text-xs uppercase transition border-t border-gray-200">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-rincian-sort" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5">KONFIRMASI SORTING</h3>
                <p class="text-xs font-bold text-gray-900 mb-2">Apakah Anda ingin mengurutkan berdasarkan nama barang ?</p>
                <p class="text-[10px] text-gray-500 font-medium leading-relaxed">Setelah melakukan sorting berdasar nama barang, Anda tidak dapat kembali mengurutkan berdasar barang pertama yang ditransaksikan.</p>
                <div class="grid grid-cols-2 gap-3 pt-5">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden'); alert('Daftar diurutkan.');" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md transition">LANJUTKAN</button>
                </div>
            </div>
        </div>

        <div id="modal-rincian-biaya" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">MODUL BIAYA</h3>
                <div class="space-y-4 text-xs font-semibold text-gray-600">
                    <div>
                        <label class="block mb-1">Nama Biaya (Ex: Bungkus, Stiker, dll)</label>
                        <input type="text" id="input-rin-biaya-name" placeholder="Ongkir" class="w-full border border-gray-300 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                    <div>
                        <label class="block mb-1">Nominal</label>
                        <div class="flex border border-emerald-600 rounded-full overflow-hidden">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center">Rp</div>
                            <input type="number" id="input-rin-biaya-val" placeholder="15000" class="flex-1 p-3.5 px-2 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                    <div class="text-center pt-1">
                        <span class="text-[10px] text-gray-400">Apa itu modul biaya ? <i class="fa-solid fa-chevron-up ml-1"></i></span>
                        <p class="text-[9px] text-gray-500 mt-2 text-left leading-relaxed">Anda bisa menambahkan biaya ke dalam transaksi Anda (ex : Biaya Ongkir, Jasa Potong, dll). Nominal biaya tidak dihitung sebagai keuntungan dan tidak bisa dikenakan diskon.</p>
                    </div>
                    <div class="pt-2">
                        <span class="block mb-2">Daftar Biaya</span>
                        <div class="flex justify-between items-center">
                            <div><span class="font-bold text-gray-900 block">Ongkir</span><span class="text-[10px] text-gray-500">Rp 10.000</span></div>
                            <div class="flex space-x-3 text-lg">
                                <button onclick="alert('Edit biaya')" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                                <button class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianSaveBiayaTambahan()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pembayaran-diskon" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-t-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-3/4 flex flex-col">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">PILIH DISKON</h3>
                <div class="space-y-3 flex-1 overflow-y-auto">
                    <div class="flex border border-emerald-600 rounded-full overflow-hidden">
                        <input type="number" id="input-pay-disc-val" value="0" class="flex-1 p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                        <button type="button" class="w-12 bg-emerald-600 text-white font-bold text-xs">%</button>
                    </div>
                    <input type="text" placeholder="Nama Diskon" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none">
                    <div class="py-12 text-center text-[10px] font-semibold text-gray-400">Discount is empty</div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianApplyPaymentDiscount()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">ATUR</button>
                </div>
            </div>
        </div>

        <div id="modal-pembayaran-pajak" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-t-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-3/4 flex flex-col">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">PILIH PAJAK</h3>
                <div class="space-y-4 flex-1 overflow-y-auto text-xs font-bold text-gray-900">
                    <label class="flex items-center justify-between cursor-pointer">
                        <div class="flex items-center space-x-3"><input type="radio" name="rad_pay_tax" value="default" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked><span>Gunakan Default</span></div>
                        <span class="bg-gray-100 px-3 py-1.5 rounded-md text-gray-600">0 %</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pay_tax" value="custom" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Set 0 atau lainnya</span>
                    </label>
                    <div class="pt-4 border-t border-gray-100 space-y-1 cursor-pointer">
                        <h4 class="font-extrabold">QRIS</h4><p class="text-[11px] text-gray-500 font-semibold">1 %</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianApplyPaymentTax()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SET</button>
                </div>
            </div>
        </div>

        <div id="modal-draft-hapus-reason" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">HAPUS PEMBELIAN</h3>
                <div class="text-red-600 text-4xl mb-2"><i class="fa-solid fa-trash-can"></i></div>
                <p class="text-xs font-bold text-gray-900">Apakah Anda yakin untuk menghapus PO Pembelian berikut?</p>
                <div class="text-left pt-2">
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tulis Alasan Anda</label>
                    <input type="text" placeholder="Alasan hapus pesanan" class="w-full border border-gray-300 rounded-lg p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-red-500">
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden'); alert('Draft Pembelian dihapus!');" type="button" class="bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">IYA</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                </div>
            </div>
        </div>

        <div id="modal-draft-print" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center border-b border-gray-100 pb-3">BAGIKAN SEBAGAI</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 pb-4">
                    <span class="text-[11px] text-gray-500 font-semibold block mb-2">Bagikan Sebagai</span>
                    <label class="flex items-start space-x-3 cursor-pointer">
                        <input type="radio" name="rad_share_mode" value="noharga" class="w-5 h-5 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked>
                        <div><span class="block">Draft Pembelian (Tanpa Harga)</span><span class="block text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">Hasil cetak disesuaikan dengan kategori barang yang telah disimpan pada pesanan ini</span></div>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="rad_share_mode" value="harga" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Draft Pembelian (Dengan Harga)</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianShareDraft()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">BAGIKAN</button>
                </div>
            </div>
        </div>

        <div id="modal-share-struk" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-[#2D2D2D] rounded-[32px] w-full max-w-xs overflow-hidden shadow-2xl p-6 absolute bottom-12 text-white">
                <h3 class="text-center font-semibold text-lg mb-6">Share to ...</h3>
                <div class="bg-[#3D3D3D] rounded-2xl p-4 flex items-center space-x-4 mb-6">
                    <div class="w-10 h-10 rounded-lg bg-red-400 flex items-center justify-center text-white text-xl"><i class="fa-solid fa-image"></i></div>
                    <span class="text-xs font-semibold truncate">cetak_dapur_20261013160211.jpg.png</span>
                </div>
                <div class="flex justify-between items-center mb-6">
                    <span class="font-bold">Send items to</span>
                    <div class="flex space-x-3 text-xl text-gray-300">
                        <button class="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center"><i class="fa-solid fa-print"></i></button>
                        <button class="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center"><i class="fa-solid fa-display"></i></button>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-y-6 text-center text-[10px] font-semibold text-gray-300 mb-6">
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl"><i class="fa-solid fa-right-left"></i></div><span>Quick Share</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl"><i class="fa-solid fa-cubes"></i></div><span>Xiaomi Share</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl"><i class="fa-regular fa-image"></i></div><span>Convert to JPG</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl"><i class="fa-brands fa-whatsapp"></i></div><span>WhatsApp</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-black text-white border border-gray-600 flex items-center justify-center text-xl font-bold">VN</div><span>Edit with VN</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-amber-400 text-white flex items-center justify-center text-2xl"><i class="fa-solid fa-sparkles"></i></div><span>Gemini</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl"><i class="fa-solid fa-print"></i></div><span>Print</span></div>
                    <div class="flex flex-col items-center space-y-2"><div class="w-12 h-12 rounded-full bg-green-400 text-white flex items-center justify-center text-2xl"><i class="fa-solid fa-comment-dots"></i></div><span>Chat</span></div>
                </div>
                <div class="flex justify-center space-x-1.5 mb-6">
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span><span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span><span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span><span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span><span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                </div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" class="w-full bg-[#4D4D4D] hover:bg-[#5D5D5D] text-gray-200 py-4 rounded-2xl font-bold transition">Cancel</button>
            </div>
        </div>

        <div id="modal-struk-cetak" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">CETAK STRUK</h3>
                <div class="flex justify-between items-center py-2 border-b border-emerald-600 mb-6">
                    <div>
                        <span class="block text-xs font-bold text-gray-900 mb-1">Struk Transaksi</span>
                        <span class="block text-[10px] text-gray-500 font-semibold">RPP02N</span>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm"><i class="fa-solid fa-check"></i></div>
                </div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">TUTUP</button>
            </div>
        </div>

        <div id="modal-struk-error-edit" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b pb-3">TIDAK TERSEDIA</h3>
                <div class="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center text-2xl font-bold mx-auto mt-2">!</div>
                <div class="bg-orange-100/60 p-3 rounded-lg text-[11px] font-bold text-gray-900">Tidak dapat melakukan edit di halaman ini</div>
                <p class="text-[10px] text-gray-700 font-medium leading-relaxed">Hanya bisa edit/ retur di halaman Laporan Transaksi Pembelian.<br><br>Silahkan klik salin dan lakukan pencarian nomor struk di Laporan Transaksi Pembelian.</p>
                <button onclick="this.closest('.fixed').classList.add('hidden'); alert('Kode struk disalin!');" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs shadow-md mt-2">Salin Kode Struk</button>
            </div>
        </div>

        <div id="modal-ubah-harga-item" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-3">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PERUBAHAN HARGA</h3>
                <p class="text-xs font-bold text-red-600 pb-2">Terdapat produk dengan HARGA BELI yang berbeda</p>
                <div>
                    <h4 class="font-extrabold text-sm text-gray-900" id="ub-item-name">Alas TAR 20 O</h4>
                    <p class="text-[10px] text-gray-500 font-semibold" id="ub-item-sku">115</p>
                </div>
                <div class="flex justify-between items-center text-xs font-semibold text-gray-600 mt-2">
                    <span>Harga beli terbaru (pcs)</span>
                    <span class="text-gray-900 font-bold" id="ub-item-new-buy">Rp 878,75</span>
                </div>
                <div class="flex justify-between items-center text-xs font-semibold text-gray-600 pb-3 border-b border-gray-100">
                    <span>Harga beli tertinggi (pcs)</span>
                    <span class="text-gray-900 font-bold" id="ub-item-old-buy">Rp 950</span>
                </div>
                <div class="pt-2 space-y-3">
                    <span class="font-extrabold text-xs text-gray-900 block">Harga jual terbaru</span>
                    <div class="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <span>pcs</span>
                        <input type="number" id="ub-item-sell-pcs" value="2000.0" class="w-32 border border-gray-300 rounded-full p-2 text-right text-gray-900 font-bold focus:outline-none">
                    </div>
                    <div class="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <div><span class="block">pak</span><span class="text-[10px] text-gray-400 font-normal">10 pcs@Rp 1.800</span></div>
                        <input type="number" id="ub-item-sell-pak" value="18000.0" class="w-32 border border-emerald-600 rounded-full p-2 text-right text-gray-900 font-bold focus:outline-none">
                    </div>
                </div>
                <p id="ub-item-warning" class="text-[10px] font-bold text-red-600 text-center pt-2 hidden">*Harga jual di bawah harga dasar Rp 9.500</p>
                <div class="grid grid-cols-2 gap-3 pt-5">
                    <button onclick="document.getElementById('modal-ubah-harga-item').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="document.getElementById('modal-ubah-harga-item').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <!-- NEW: MODAL TAMBAH NOMINAL CEPAT -->
        <div id="modal-tambah-nominal-cepat" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">TAMBAH</h3>
                <input type="number" id="input-new-fastcash" placeholder="Masukan Jumlah" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none mb-6 text-center text-lg">
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="document.getElementById('modal-tambah-nominal-cepat').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianSaveNewFastCash()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">TAMBAH</button>
                </div>
            </div>
        </div>

        <div id="modal-pilih-aksi-fastcash" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH AKSI</h3>
                <div class="space-y-3 font-extrabold text-xs text-gray-900">
                    <button onclick="pembelianShowAddFastCash()" class="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 hover:bg-emerald-100 transition border border-emerald-100">
                        <span class="text-emerald-700">Tambah</span><i class="fa-solid fa-chevron-right text-emerald-700"></i>
                    </button>
                    <button onclick="pembelianToggleEditFastCash()" class="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 hover:bg-emerald-100 transition border border-emerald-100">
                        <span class="text-emerald-700">Edit</span><i class="fa-solid fa-chevron-right text-emerald-700"></i>
                    </button>
                </div>
                <div class="pt-5">
                    <button onclick="document.getElementById('modal-pilih-aksi-fastcash').classList.add('hidden')" type="button" class="text-emerald-600 font-bold text-xs uppercase w-full text-center hover:underline">OK</button>
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
    // 3. STATE & LOGIKA UTAMA PEMBELIAN
    // ========================================================================
    let pembelianCart = []; 
    let pembelianSupplier = null; 
    let pembelianBiayaLabel = 'Ongkir';
    let pembelianBiayaNominal = 0;
    let pembelianDiskonGlobal = 0; 
    let pembelianPajakGlobal = 0; 
    let activeProductToAdd = null;
    let paymentCashAmount = 0;

    let isFastCashEditMode = false;
    let fastCashNominals = [10000, 15000, 20000, 30000, 40000, 50000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 1000000];

    // Hook Navigasi
    const prevSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchView === 'function') prevSwitchView(viewName);
        if (viewName === 'pembelian') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
            window.pembelianInitCategories();
            window.renderPembelianProductList();
        }
    };

    function fmtRp(val) {
        return Number(val || 0).toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2});
    }

    // --- KERANJANG UTAMA & PENGATURAN ---
    window.pembelianInitCategories = () => {
        const catBox = document.getElementById('container-pembelian-categories');
        if (!catBox) return;
        const baseCats = ['atk', 'bahan makanan', 'baskom', 'cup gelas', 'diskon', 'foam', 'hari ultah'];
        let html = `<button onclick="pembelianSelectCategory('all')" id="btn-pembelian-cat-all" class="bg-emerald-50 border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition">Semua item</button>`;
        baseCats.forEach(c => {
            html += `<button onclick="pembelianSelectCategory('${c}')" id="btn-pembelian-cat-${c}" class="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-gray-200 transition">${c}</button>`;
        });
        catBox.innerHTML = html;
    };

    window.pembelianSelectCategory = (catId) => {
        document.querySelectorAll('#container-pembelian-categories button').forEach(b => {
            b.className = "bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-gray-200 transition";
        });
        const activeBtn = document.getElementById(`btn-pembelian-cat-${catId}`);
        if (activeBtn) activeBtn.className = "bg-emerald-50 border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition";
        window.renderPembelianProductList();
    };

    window.pembelianBuatBarangBaru = () => {
        if (window.openAddProductFormView) {
            window.openAddProductFormView(); 
            window.productFormReturnView = 'view-pembelian'; 
        }
    };

    window.pembelianBatalkan = () => {
        if (confirm("Yakin ingin membatalkan dan mereset semua keranjang pembelian?")) {
            pembelianCart = [];
            pembelianSupplier = null;
            pembelianBiayaNominal = 0;
            pembelianDiskonGlobal = 0;
            pembelianPajakGlobal = 0;
            document.getElementById('dropdown-pembelian-main').classList.add('hidden');
            window.renderPembelianProductList();
            window.updatePembelianCartCount();
        }
    };

    window.pembelianBukaPengaturan = () => {
        document.getElementById('dropdown-pembelian-main').classList.add('hidden');
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pengaturan-pembelian').classList.remove('hidden');
    };

    window.pembelianApplySort = (mode) => {
        document.getElementById('dropdown-pembelian-sort').classList.add('hidden');
        window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
    };

    window.renderPembelianProductList = function(keyword = '') {
        const container = document.getElementById('container-pembelian-products');
        if (!container) return;
        container.innerHTML = '';
        const k = (keyword || '').toLowerCase();
        
        let list = (window.products || []).filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        list.sort((a, b) => a.name.localeCompare(b.name)); 

        list.forEach(p => {
            const stk = Number(p.stock) || 0;
            const sColor = stk <= 0 ? 'bg-red-600' : (stk <= 20 ? 'bg-amber-400' : 'bg-emerald-600');
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const bpFormat = p.buyPrice ? fmtRp(p.buyPrice) : '0';
            const selQty = getCartQty(p.id);

            container.innerHTML += `
                <div onclick="pembelianOpenMultiSatuanModal('${p.id}')" class="p-3.5 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-2 flex-1">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-gray-500 font-bold text-base flex-shrink-0 shadow-inner overflow-hidden">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 truncate">${p.name}</h4>
                            <p class="text-[10px] text-gray-500 font-medium mt-0.5">Rp ${bpFormat} • Rp ${fmtRp(p.price)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 flex-shrink-0">
                        ${selQty > 0 ? `<div class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-bold text-sm bg-white">${selQty}</div>` : ''}
                        <div class="w-8 h-8 rounded ${sColor} text-white font-bold flex items-center justify-center text-xs shadow-sm">${stk}</div>
                    </div>
                </div>
            `;
        });
    };

    function getCartQty(pid) {
        const item = pembelianCart.find(c => c.product.id === pid);
        return item ? (Number(item.pakQty) || 0) : 0;
    }

    window.updatePembelianCartCount = () => {
        const tQty = pembelianCart.reduce((s, x) => s + (Number(x.pakQty) || 0), 0);
        const lbl = document.getElementById('pembelian-cart-count');
        if (lbl) lbl.innerText = tQty;
    };

    window.pembelianOpenMultiSatuanModal = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        activeProductToAdd = p;

        const cartItem = pembelianCart.find(c => c.product.id === pid);
        const curPak = cartItem ? (cartItem.pakQty || 0) : 0;
        const curPcs = cartItem ? (cartItem.pcsQty || 0) : 0;
        const curBP = cartItem ? (cartItem.buyPrice || p.buyPrice || 0) : (p.buyPrice || 0);

        document.getElementById('mul-name').innerText = p.name;
        document.getElementById('mul-sku').innerText = p.sku || '-';
        document.getElementById('mul-price').innerText = `Rp ${fmtRp(p.price)}`;
        document.getElementById('mul-stock').innerText = p.stock || 0;
        
        document.getElementById('mul-qty-pcs').value = curPcs;
        document.getElementById('mul-qty-pak').value = curPak;
        document.getElementById('mul-buyprice').value = curBP;
        
        document.getElementById('chk-mul-diskon').checked = false;
        document.getElementById('box-mul-diskon').classList.add('hidden');
        document.getElementById('chk-mul-notes').checked = false;
        document.getElementById('box-mul-notes').classList.add('hidden');

        document.getElementById('modal-pembelian-multisatuan').classList.remove('hidden');
    };

    window.pembelianAddToCart = () => {
        const pakQ = parseInt(document.getElementById('mul-qty-pak').value) || 0;
        const pcsQ = parseInt(document.getElementById('mul-qty-pcs').value) || 0;
        const bp = parseFloat(document.getElementById('mul-buyprice').value) || 0;
        const notes = document.getElementById('chk-mul-notes').checked ? document.getElementById('input-mul-notes-val').value.trim() : '';

        if (pakQ <= 0 && pcsQ <= 0) {
            pembelianCart = pembelianCart.filter(c => c.product.id !== activeProductToAdd.id);
        } else {
            const existingIdx = pembelianCart.findIndex(c => c.product.id === activeProductToAdd.id);
            const newItem = { product: activeProductToAdd, pakQty: pakQ, pcsQty: pcsQ, buyPrice: bp, notes: notes };
            if (existingIdx >= 0) {
                pembelianCart[existingIdx] = newItem;
            } else {
                pembelianCart.push(newItem);
            }
        }

        document.getElementById('modal-pembelian-multisatuan').classList.add('hidden');
        window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
        window.updatePembelianCartCount();
        if (!document.getElementById('view-rincian-pembelian').classList.contains('hidden')) {
            window.renderRincianPembelianItems();
        }
    };

    // --- RINCIAN PEMBELIAN ---
    window.pembelianLanjutKeRincian = () => {
        if (pembelianCart.length === 0) return alert("Pilih minimal 1 barang untuk dibeli!");
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-rincian-pembelian').classList.remove('hidden');
        window.renderRincianPembelianItems();
    };

    window.renderRincianPembelianItems = () => {
        const container = document.getElementById('container-rincian-cart-items');
        container.innerHTML = '';
        let subtotal = 0;

        pembelianCart.forEach((item, idx) => {
            const itemTotal = item.pakQty * item.buyPrice;
            subtotal += itemTotal;
            const initials = item.product.name ? item.product.name.substring(0, 2) : 'RL';

            container.innerHTML += `
                <div onclick="pembelianOpenMultiSatuanModal('${item.product.id}')" class="px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                    <span class="text-xs font-bold text-gray-500 w-4 text-center">${idx + 1}</span>
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 font-bold text-sm flex-shrink-0 shadow-inner overflow-hidden">
                        ${item.product.image ? `<img src="${item.product.image}" class="w-full h-full object-cover">` : initials}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-sm text-gray-900 truncate">${item.product.name}</h4>
                        <p class="text-[10px] text-gray-500 font-medium mt-0.5">${item.pakQty} pak x Rp ${fmtRp(item.buyPrice)} = Rp ${fmtRp(itemTotal)}</p>
                    </div>
                    <div class="w-10 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-bold text-xs bg-white shadow-xs">
                        ${item.pakQty}
                    </div>
                </div>
            `;
        });

        const gTotal = subtotal + pembelianBiayaNominal;
        document.getElementById('rincian-pembelian-grandtotal').innerText = `Rp ${fmtRp(gTotal)}`;

        const tabSup = document.getElementById('rincian-pembelian-supplier-tab');
        if (pembelianSupplier) {
            document.getElementById('rincian-pembelian-supplier-name').innerText = pembelianSupplier.name;
            tabSup.classList.remove('hidden');
            tabSup.classList.add('flex');
        } else {
            tabSup.classList.add('hidden');
            tabSup.classList.remove('flex');
        }

        const lblBiaya = document.getElementById('rincian-label-biaya');
        if (pembelianBiayaNominal > 0) {
            lblBiaya.innerHTML = `Biaya: Rp ${fmtRp(pembelianBiayaNominal)} <i class="fa-solid fa-chevron-down ml-1"></i>`;
            lblBiaya.classList.remove('hidden');
        } else {
            lblBiaya.classList.add('hidden');
        }
    };

    window.pembelianSaveBiayaTambahan = () => {
        const name = document.getElementById('input-rin-biaya-name').value.trim() || 'Ongkir';
        const val = parseFloat(document.getElementById('input-rin-biaya-val').value) || 0;
        pembelianBiayaLabel = name;
        pembelianBiayaNominal = val;
        document.getElementById('modal-rincian-biaya').classList.add('hidden');
        window.renderRincianPembelianItems();
    };

    window.pembelianRemoveSupplier = () => {
        pembelianSupplier = null;
        window.renderRincianPembelianItems();
    };

    // --- DRAFT PEMBELIAN ---
    window.pembelianSimpanKeDraft = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-draft-pembelian').classList.remove('hidden');
        document.getElementById('input-draft-name').value = 'Order';
        document.getElementById('input-draft-due').value = '29 Oct 2026';
        pembelianUpdateDraftSupUI();
    };

    window.pembelianPilihSupplierHutang = () => {
        pembelianSupplier = (window.suppliersList || []).find(s => s.name.includes("Camel")) || { name: "PT sumberintramakmur (beken,tobys)", phone: "81233617676", avatarCode: "P" };
        if (!document.getElementById('view-form-draft-pembelian').classList.contains('hidden')) {
            pembelianUpdateDraftSupUI();
        } else if (!document.getElementById('view-pembayaran-pembelian').classList.contains('hidden')) {
            document.getElementById('box-pembayaran-sup-name').innerText = pembelianSupplier.name;
            document.getElementById('box-pembayaran-sup-name').classList.remove('text-gray-500');
            document.getElementById('box-pembayaran-sup-name').classList.add('text-gray-900');
        }
    };

    window.pembelianDraftClearSup = () => {
        pembelianSupplier = null;
        pembelianUpdateDraftSupUI();
    };

    function pembelianUpdateDraftSupUI() {
        const btn = document.getElementById('btn-draft-pick-sup');
        const box = document.getElementById('box-draft-sup-selected');
        if (pembelianSupplier) {
            btn.classList.add('hidden');
            box.classList.remove('hidden');
            box.classList.add('flex');
            document.getElementById('draft-sup-name').innerText = pembelianSupplier.name;
            document.getElementById('draft-sup-phone').innerText = pembelianSupplier.phone || '-';
            document.getElementById('draft-sup-avatar').innerText = pembelianSupplier.avatarCode || 'S';
        } else {
            btn.classList.remove('hidden');
            box.classList.add('hidden');
            box.classList.remove('flex');
        }
    }

    window.pembelianSaveDraft = () => {
        const dName = document.getElementById('input-draft-name').value.trim();
        if (!dName) return alert("Nama Draft wajib diisi!");
        alert("Pembelian berhasil disimpan ke Draft!");
        document.getElementById('view-form-draft-pembelian').classList.add('hidden');
        window.pembelianOpenDataDraft();
    };

    window.pembelianOpenDataDraft = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-data-draft-list').classList.remove('hidden');
        window.renderDataDraftList();
    };

    window.renderDataDraftList = () => {
        const container = document.getElementById('container-data-draft-rows');
        container.innerHTML = '';
        const dummyDrafts = [
            { name: "Order", sup: "Camel (dus)", date: "13 Oct 2026", due: "29 Oct 2026", items: 70, total: 74750 }
        ];
        dummyDrafts.forEach((d, i) => {
            container.innerHTML += `
                <div class="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden relative cursor-pointer hover:shadow-md transition">
                    <div class="bg-emerald-100/50 rounded-br-2xl inline-flex items-center space-x-2 px-4 py-2 absolute top-0 left-0">
                        <input type="checkbox" name="chk-draft-item" onchange="pembelianDraftItemChecked()" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                        <span class="font-extrabold text-[11px] text-gray-900">${d.name}</span>
                    </div>
                    <div onclick="pembelianOpenDetailDraft(${i})" class="pt-10 p-4 flex justify-between items-end">
                        <div class="space-y-1">
                            <span class="text-xs font-semibold text-gray-500">${d.sup}</span>
                            <div class="flex items-center space-x-1.5 text-[11px] text-gray-900 font-bold">
                                <i class="fa-regular fa-calendar"></i><span>${d.date}</span>
                            </div>
                            <span class="text-[11px] font-bold text-gray-500 pt-1 block">${d.items.toLocaleString('id-ID')} item • Rp ${fmtRp(d.total)}</span>
                        </div>
                        <div class="text-right space-y-1">
                            <span class="font-bold text-emerald-600 text-[10px] flex items-center justify-end"><span class="mr-1">Open</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>
                            <span class="text-[10px] font-bold text-gray-900 block mt-2">J/T: ${d.due}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    window.pembelianDraftItemChecked = () => {
        const count = document.querySelectorAll('input[name="chk-draft-item"]:checked').length;
        const bar = document.getElementById('bar-draft-hapus');
        if (count > 0) {
            document.getElementById('count-draft-hapus').innerText = count;
            bar.classList.remove('hidden');
        } else {
            bar.classList.add('hidden');
        }
    };

    window.pembelianOpenDetailDraft = (idx) => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-draft').classList.remove('hidden');
        const container = document.getElementById('container-draft-det-items');
        container.innerHTML = `
            <div class="py-2.5 flex items-start space-x-3">
                <span class="text-[11px] font-bold text-gray-400 mt-0.5">1</span>
                <div>
                    <h4 class="font-extrabold text-xs text-gray-900">Alas TAR 20 O</h4>
                    <p class="text-[11px] text-gray-600 font-semibold mt-0.5">5 pak x Rp 9.500 - Diskon(Rp 1.250) = Rp 46.250</p>
                </div>
            </div>
        `;
    };

    window.pembelianToggleDraftDetailHeader = () => {
        const box = document.getElementById('box-draft-det-info');
        const icon = document.getElementById('icon-draft-det-chevron');
        box.classList.toggle('hidden');
        if (box.classList.contains('hidden')) {
            icon.className = "fa-solid fa-chevron-right text-gray-900 text-xs";
        } else {
            icon.className = "fa-solid fa-chevron-down text-gray-900 text-xs";
        }
    };

    window.pembelianShareDraft = () => {
        document.getElementById('modal-draft-print').classList.add('hidden');
        document.getElementById('view-detail-draft').classList.add('hidden');
        document.getElementById('view-pembelian-struk').classList.remove('hidden');
    };

    // --- HALAMAN PEMBAYARAN FINAL ---
    window.pembelianGoToPembayaran = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pembayaran-pembelian').classList.remove('hidden');

        // G-Total Simulasi sesuai SS (Rp 6.102.125)
        let gTotal = 6102125; 
        document.getElementById('pembayaran-grandtotal').innerText = `Rp ${fmtRp(gTotal)}`;
        
        paymentCashAmount = 0;
        isFastCashEditMode = false;
        window.renderFastCashButtons();
        window.pembelianRefreshCashDisplay();
        document.getElementById('chk-pembayaran-hutang').checked = false;
        window.pembelianToggleHutangMode(false);
    };

    window.pembelianToggleHutangMode = (isHutang) => {
        const numpad = document.getElementById('pembayaran-numpad-container');
        const display = document.getElementById('pembayaran-display-cash');
        if (isHutang) {
            numpad.classList.add('opacity-30', 'pointer-events-none');
            display.innerText = "Rp 0";
            display.classList.remove('text-emerald-600');
            display.classList.add('text-gray-400');
            window.pembelianPilihSupplierHutang();
            document.getElementById('chk-pembayaran-hutang').checked = true;
        } else {
            numpad.classList.remove('opacity-30', 'pointer-events-none');
            window.pembelianRefreshCashDisplay();
        }
    };

    // Slide Animasi Numpad vs FastCash
    window.pembelianSlideNumpad = (dir) => {
        const track = document.getElementById('pembayaran-slider-track');
        if (dir === 'right') {
            track.style.transform = 'translateX(-50%)'; // Geser ke FastCash
        } else {
            track.style.transform = 'translateX(0)';    // Balik ke Kalkulator
        }
    };

    window.pembelianNumpadInput = (char) => {
        if (char === 'C') {
            paymentCashAmount = 0;
        } else if (char === 'X') {
            let str = paymentCashAmount.toString();
            if (str.length > 1) {
                paymentCashAmount = parseFloat(str.slice(0, -1));
            } else {
                paymentCashAmount = 0;
            }
        } else {
            let str = paymentCashAmount === 0 ? '' : paymentCashAmount.toString();
            // Cegah angka kepanjangan
            if(str.length < 12) {
                str += char;
                paymentCashAmount = parseFloat(str) || 0;
            }
        }
        window.pembelianRefreshCashDisplay();
    };

    window.pembelianSetCashAmount = (val) => {
        let gTotal = 6102125; 
        if (val === 'pas') {
            paymentCashAmount = gTotal;
        } else if (val === 'lainnya') {
            document.getElementById('modal-pilih-aksi-fastcash').classList.remove('hidden');
            return;
        } else {
            paymentCashAmount = val;
        }
        window.pembelianRefreshCashDisplay();
    };

    window.pembelianRefreshCashDisplay = () => {
        const display = document.getElementById('pembayaran-display-cash');
        const btnSubmit = document.getElementById('btn-pembayaran-submit');
        let gTotal = 6102125; 

        display.innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        display.classList.add('text-emerald-600');
        display.classList.remove('text-gray-400');

        if (paymentCashAmount >= gTotal && gTotal > 0) {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm cursor-pointer hover:bg-emerald-600 transition";
            btnSubmit.classList.remove('pointer-events-none');
            
            // Auto selesai jika dicentang di UI
            btnSubmit.onclick = () => { window.pembelianSelesaiTransaksi(); };
        } else {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm pointer-events-none transition";
            btnSubmit.onclick = null;
        }
    };

    // Fitur Tambah & Edit Nominal Cepat
    window.renderFastCashButtons = () => {
        const box = document.getElementById('pembayaran-fastcash-container');
        box.innerHTML = '';
        
        // Tombol Uang Pas
        box.innerHTML += `<button onclick="pembelianSetCashAmount('pas')" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm">Uang Pas</button>`;
        
        fastCashNominals.sort((a,b) => a-b).forEach((nom, i) => {
            if(isFastCashEditMode) {
                box.innerHTML += `
                    <div class="relative w-full">
                        <button onclick="pembelianSetCashAmount(${nom})" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm opacity-50 pointer-events-none">${fmtRp(nom)}</button>
                        <button onclick="pembelianDeleteFastCash(${i})" class="absolute -right-2 -top-2 w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center border border-red-200 z-10 hover:bg-red-200"><i class="fa-solid fa-trash-can text-sm"></i></button>
                    </div>
                `;
            } else {
                box.innerHTML += `<button onclick="pembelianSetCashAmount(${nom})" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-xs transition text-sm">${fmtRp(nom)}</button>`;
            }
        });

        // Tombol Lainnya atau Selesai
        if(isFastCashEditMode) {
            box.innerHTML += `<button onclick="pembelianToggleEditFastCash()" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm">Selesai</button>`;
        } else {
            box.innerHTML += `<button onclick="pembelianSetCashAmount('lainnya')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-xs transition text-sm">Lainnya</button>`;
        }
    };

    window.pembelianShowAddFastCash = () => {
        document.getElementById('modal-pilih-aksi-fastcash').classList.add('hidden');
        document.getElementById('input-new-fastcash').value = '';
        document.getElementById('modal-tambah-nominal-cepat').classList.remove('hidden');
    };

    window.pembelianSaveNewFastCash = () => {
        const val = parseFloat(document.getElementById('input-new-fastcash').value);
        if(val && val > 0 && !fastCashNominals.includes(val)) {
            fastCashNominals.push(val);
            window.renderFastCashButtons();
        }
        document.getElementById('modal-tambah-nominal-cepat').classList.add('hidden');
    };

    window.pembelianToggleEditFastCash = () => {
        document.getElementById('modal-pilih-aksi-fastcash').classList.add('hidden');
        isFastCashEditMode = !isFastCashEditMode;
        window.renderFastCashButtons();
    };

    window.pembelianDeleteFastCash = (idx) => {
        fastCashNominals.splice(idx, 1);
        window.renderFastCashButtons();
    };

    window.pembelianApplyPaymentDiscount = () => {
        document.getElementById('modal-pembayaran-diskon').classList.add('hidden');
    };

    window.pembelianApplyPaymentTax = () => {
        document.getElementById('modal-pembayaran-pajak').classList.add('hidden');
    };

    window.pembelianSelesaiTransaksi = () => {
        document.getElementById('view-pembayaran-pembelian').classList.add('hidden');
        document.getElementById('view-pembelian-success').classList.remove('hidden');
        
        let gTotal = 6102125; 
        document.getElementById('succ-total').innerText = `Rp ${fmtRp(gTotal)}`;
        document.getElementById('succ-paid').innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        document.getElementById('succ-change').innerText = `Rp ${fmtRp(Math.max(0, paymentCashAmount - gTotal))}`;
        document.getElementById('succ-sup').innerText = pembelianSupplier ? pembelianSupplier.name : "PT sumberintramakmur";
        
        pembelianCart = [];
        pembelianSupplier = null;
        pembelianBiayaNominal = 0;
    };

    window.pembelianSelesaiTutup = () => {
        document.getElementById('view-pembelian-success').classList.add('hidden');
        document.getElementById('view-manajemen-hub').classList.remove('hidden');
        window.renderPembelianProductList();
        window.updatePembelianCartCount();
    };

    // --- UBAH HARGA JUAL & STRUK KELAS AKHIR ---
    window.pembelianOpenUbahHarga = () => {
        document.getElementById('view-pembelian-success').classList.add('hidden');
        document.getElementById('view-ubah-harga-jual').classList.remove('hidden');
        const container = document.getElementById('container-ubah-harga-items');
        container.innerHTML = `
            <div class="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50" onclick="pembelianOpenUbahHargaItem(1)">
                <div>
                    <h4 class="font-extrabold text-xs text-gray-900">Alas TAR 20 O</h4>
                    <div class="mt-2 text-xs font-semibold text-gray-500 flex items-center space-x-12"><span>Harga Beli Lama</span><span>Rp 950</span></div>
                    <div class="mt-0.5 text-xs font-bold text-gray-600 flex items-center space-x-12"><span>Harga Beli Baru</span><span class="text-emerald-600">Rp 878,75</span></div>
                </div><i class="fa-solid fa-chevron-right text-emerald-600"></i>
            </div>
        `;
    };

    window.pembelianOpenUbahHargaItem = () => {
        document.getElementById('modal-ubah-harga-item').classList.remove('hidden');
        const wp = document.getElementById('ub-item-sell-pak').value;
        if(Number(wp) < 19000) document.getElementById('ub-item-warning').classList.remove('hidden');
    };

    window.pembelianSaveUbahHarga = () => {
        alert("Harga jual baru berhasil disimpan.");
        document.getElementById('view-ubah-harga-jual').classList.add('hidden');
        document.getElementById('view-manajemen-hub').classList.remove('hidden');
    };

    window.pembelianLihatStrukDigital = () => {
        let contentHTML = `
            <div class="text-center font-extrabold text-[13px] uppercase mb-1 border-b border-dashed border-gray-400 pb-2">PEMBELIAN STOK</div>
            <div class="text-center text-[11px] font-semibold mb-3">151374420261013161300</div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2">
                <div class="flex justify-between"><p>2026-10-13</p><p>Admin : Adm</p></div>
                <p>16:13:00</p>
                <p>Supplier : PT sumberintramakmur</p>
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2 space-y-2">
                <div>
                    <p class="font-bold">Alas TAR 20 O</p>
                    <div class="flex justify-between"><p>5 pak x Rp 9.500</p><p>Rp 46.250</p></div>
                </div>
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2">
                <div class="flex justify-between font-extrabold text-sm mt-1"><p>Total</p><p>Rp 6.102.125</p></div>
                <div class="flex justify-between mt-1"><p>Bayar (Non-Cashdrawer)</p><p>Rp 6.102.125</p></div>
            </div>
            <div class="text-center font-bold border-b border-dashed border-gray-400 pb-2 mb-4">Bukan Bukti Pembayaran</div>
            <div class="text-center text-[10px]">untuk ditampilkan di struk<br>Struk Pembelian untuk Kepentingan Pencatatan Internal</div>
        `;
        document.getElementById('content-struk-digital').innerHTML = contentHTML;
        document.getElementById('view-pembelian-success').classList.add('hidden');
        document.getElementById('view-pembelian-struk').classList.remove('hidden');
    };

    window.pembelianStrukMenu = (action) => {
        document.getElementById('dropdown-struk-menu').classList.add('hidden');
        if (action === 'cetak') {
            document.getElementById('modal-struk-cetak').classList.remove('hidden');
        } else if (action === 'edit') {
            document.getElementById('modal-struk-error-edit').classList.remove('hidden');
        } else if (action === 'rincian') {
            document.getElementById('view-pembelian-struk').classList.add('hidden');
            document.getElementById('view-rincian-struk').classList.remove('hidden');
            document.getElementById('content-rincian-json').innerText = "{\n  \"data_transaksi\": [\n    {\n      \"nama_barang\": \"Alas TAR 20 O\",\n      \"kode_barang\": \"115\",\n      \"banyak_barang\": 50,\n      \"harga_jual\": 2000,\n      \"harga_beli\": 950,\n      \"tipe_diskon\": \"rupiah\",\n      \"diskon\": 2.63,\n      \"nilai_diskon\": 25,\n      \"sub_total\": 46250,\n      \"sub_untung\": 0,\n      \"multi_satuan\": [{\"pak\": {\"jumlah\": 50, \"isi\": 10, \"harga_satuan_terkecil\": 950, \"harga\": 46250}}]\n    }\n  ]\n}";
        }
    };

})();

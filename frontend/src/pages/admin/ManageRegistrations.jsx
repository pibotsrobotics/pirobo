import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table as TableIcon, Users, ArrowLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { registrationService } from '../../services';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ManageRegistrations = () => {
    const [allRegistrations, setAllRegistrations] = useState([]);
    const [groupedItems, setGroupedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // If null, show list. If set, show details.
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        setIsLoading(true);
        const data = await registrationService.getAll();
        setAllRegistrations(data.reverse());

        // Group data by Item ID (or Title if ID missing for some reason)
        const groups = {};
        data.forEach(reg => {
            const key = reg.itemId || reg.itemTitle; // Fallback to title if ID is somehow missing
            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    title: reg.itemTitle,
                    type: reg.type,
                    // Capture event/course details from the first registration record
                    eventDate: reg.eventDate,
                    eventLocation: reg.eventLocation,
                    courseDuration: reg.courseDuration,
                    count: 0,
                    registrations: []
                };
            }
            groups[key].registrations.push(reg);
            groups[key].count++;
        });
        setGroupedItems(Object.values(groups));

        setIsLoading(false);
    };

    // --- Export to XLSX (Real Excel) ---
    const exportToExcel = () => {
        try {
            if (!selectedItem || selectedItem.registrations.length === 0) return alert("No data to export");

            // Prepare data
            const dataForSheet = selectedItem.registrations.map(row => ({
                "Student Name": row.name,
                "Email": row.email,
                "Phone": row.phone,
                "Date": row.date,
                "Status": row.status
            }));

            // Create Worksheet
            const ws = XLSX.utils.json_to_sheet(dataForSheet);

            // Adjust column widths
            const colWidths = [
                { wch: 20 }, // Name
                { wch: 25 }, // Email
                { wch: 15 }, // Phone
                { wch: 15 }, // Date
                { wch: 15 }  // Status
            ];
            ws['!cols'] = colWidths;

            // Create Workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Registrations");

            // Generate filename
            const filename = `${selectedItem.title.replace(/[^a-zA-Z0-9]/g, '_')}_Student_List.xlsx`;

            // Write and Download
            XLSX.writeFile(wb, filename);
        } catch (error) {
            console.error("Excel Export Error:", error);
            alert("Failed to export Excel file.");
        }
    };

    // --- Export to PDF ---
    const exportToPDF = () => {
        try {
            if (!selectedItem || selectedItem.registrations.length === 0) return alert("No data to export");

            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.text(selectedItem.title, 14, 20);
            doc.setFontSize(12);
            doc.text(`Registration Report (${selectedItem.type})`, 14, 28);

            if (selectedItem.type === 'Event' && selectedItem.eventDate) {
                doc.text(`Event Date: ${selectedItem.eventDate}`, 14, 34);
                doc.text(`Venue: ${selectedItem.eventLocation}`, 14, 40);
            }

            doc.setFontSize(10);
            const startY = selectedItem.type === 'Event' ? 48 : 34; // Adjust Y based on event details
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, startY);
            doc.text(`Total Students: ${selectedItem.count}`, 14, startY + 6);

            // Table
            const tableColumn = ["Student Name", "Email", "Phone", "Date", "Status"];
            const tableRows = [];

            selectedItem.registrations.forEach(row => {
                const rowData = [
                    row.name,
                    row.email,
                    row.phone,
                    row.date,
                    row.status
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: startY + 12, // Start below the header info
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [249, 115, 22] }
            });

            doc.save(`${selectedItem.title.replace(/\s+/g, '_')}_Report.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Failed to export PDF: " + error.message);
        }
    };

    // --- RENDER: Detail View ---
    if (selectedItem) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setSelectedItem(null)} variant="outline" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all h-10 px-3 shadow-sm">
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">{selectedItem.title}</h1>
                            <div className="text-gray-500 dark:text-gray-400 font-medium flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${selectedItem.type === 'Course' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'}`}>
                                        {selectedItem.type}
                                    </span>
                                    <span className="text-sm font-bold">• {selectedItem.count} Registered Students</span>
                                </div>

                                {selectedItem.type === 'Event' && selectedItem.eventDate && (
                                    <>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-sm font-bold">
                                            <Calendar size={15} /> {selectedItem.eventDate}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                                            <MapPin size={15} /> {selectedItem.eventLocation}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={exportToExcel} className="gap-2 bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 transition-all rounded-xl font-bold uppercase tracking-widest text-xs h-11">
                            <TableIcon size={18} /> Export Excel
                        </Button>
                        <Button onClick={exportToPDF} className="gap-2 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all rounded-xl font-bold uppercase tracking-widest text-xs h-11">
                            <FileText size={18} /> Export PDF
                        </Button>
                    </div>
                </div>

                <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-2xl rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-50/80 dark:bg-black/60 text-gray-500 dark:text-gray-300 uppercase font-black tracking-widest text-[10px] border-b border-gray-100 dark:border-white/10">
                                <tr>
                                    <th className="px-8 py-6">Student Name</th>
                                    <th className="px-8 py-6">Contact Info</th>
                                    <th className="px-8 py-6">Registration Date</th>
                                    <th className="px-8 py-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {selectedItem.registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-gray-900 dark:text-white text-base group-hover:text-orange-600 transition-colors uppercase tracking-tight">{reg.name}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-600 dark:text-gray-300 font-bold">{reg.email}</span>
                                                <span className="text-xs text-orange-500 dark:text-orange-400 font-mono font-bold">{reg.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider">{reg.date}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-green-600 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 shadow-sm">
                                                {reg.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        );
    }

    // --- RENDER: Overview List ---
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Registrations Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Select a course or event to view registered students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full text-center py-12 text-gray-500 flex items-center justify-center gap-2 font-medium">
                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Users size={24} className="text-orange-500" />
                        </motion.div>
                        Loading registrations details...
                    </div>
                ) : groupedItems.length === 0 ? (
                    <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-400">
                        <Users size={48} className="mb-4 opacity-20" />
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">No registrations yet</p>
                        <p className="text-sm font-medium">Students will appear here once they sign up.</p>
                    </div>
                ) : (
                    groupedItems.map((item) => (
                        <Card
                            key={item.id}
                            className="bg-white dark:bg-gray-900/40 backdrop-blur-md border border-gray-100 dark:border-white/5 cursor-pointer group flex flex-col h-full hover:bg-white dark:hover:bg-gray-800/60 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 rounded-3xl overflow-hidden shadow-md"
                            onClick={() => setSelectedItem(item)}
                        >
                            <div className="p-8 flex flex-col flex-grow relative overflow-hidden">
                                {/* Subtle background glow based on item type */}
                                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-30 ${item.type === 'Course' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`p-4 rounded-2xl shadow-lg border ${item.type === 'Course' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'}`}>
                                        <Users size={28} />
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${item.type === 'Course' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'}`}>
                                        {item.type}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors line-clamp-2 leading-none uppercase tracking-tight relative z-10">{item.title}</h3>

                                <div className="space-y-4 mt-1 mb-8 text-sm font-bold text-gray-500 dark:text-gray-400 relative z-10">
                                    <p className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></span> {item.count} Students Joined</p>

                                    {/* Show Date/Venue for Events */}
                                    {item.type === 'Event' && item.eventDate && (
                                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} className="text-orange-500" /> <span className="text-gray-700 dark:text-gray-300">{item.eventDate}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <MapPin size={18} className="text-orange-500 shrink-0" /> <span className="text-gray-400 truncate font-semibold uppercase tracking-wider">{item.eventLocation}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show Duration for Courses */}
                                    {item.type === 'Course' && item.courseDuration && (
                                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-orange-500" /> <span className="text-gray-700 dark:text-gray-300 uppercase tracking-widest text-xs font-black">{item.courseDuration}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 flex items-center text-orange-600 font-black uppercase tracking-widest text-[11px] border-t border-gray-100 dark:border-white/5 group-hover:border-orange-500/20 transition-colors relative z-10">
                                    View Full List <ChevronRight size={18} className="ml-1 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageRegistrations;

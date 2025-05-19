
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import sheetService from "@/services/sheetService";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";

interface StaffReportProps {
  dateRange: DateRange;
}

export function StaffReport({ dateRange }: StaffReportProps) {
  // Fetch staff and attendance data
  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => sheetService.getStaffMembers(),
  });
  
  const { data: attendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => sheetService.getAttendance(),
  });
  
  if (isLoadingStaff || isLoadingAttendance) {
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h3 className="text-lg font-medium mb-4">Loading staff data...</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Filter attendance records by date range
  const filteredAttendance = attendance?.filter(record => {
    const recordDate = new Date(record.date);
    if (dateRange.from && dateRange.to) {
      return recordDate >= dateRange.from && recordDate <= dateRange.to;
    }
    return true;
  }) || [];
  
  // Process attendance statistics by staff member
  const attendanceByStaff = staff?.map(staffMember => {
    const staffAttendance = filteredAttendance.filter(
      record => record.staffId === staffMember.id
    );
    
    const presentDays = staffAttendance.filter(
      record => record.status === 'Present'
    ).length;
    
    const halfDays = staffAttendance.filter(
      record => record.status === 'Half-day'
    ).length;
    
    const absentDays = staffAttendance.filter(
      record => record.status === 'Absent'
    ).length;
    
    return {
      id: staffMember.id,
      name: staffMember.name,
      role: staffMember.role,
      presentDays,
      halfDays,
      absentDays,
      totalDays: presentDays + halfDays + absentDays
    };
  }) || [];
  
  // Calculate attendance percentage
  const attendanceData = attendanceByStaff.map(record => ({
    name: record.name,
    present: record.totalDays > 0 ? (record.presentDays / record.totalDays) * 100 : 0,
    absent: record.totalDays > 0 ? (record.absentDays / record.totalDays) * 100 : 0,
    halfDay: record.totalDays > 0 ? (record.halfDays / record.totalDays) * 100 : 0,
    totalDays: record.totalDays
  }));

  return (
    <div className="space-y-4">
      {/* Attendance Chart */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Staff Attendance Statistics</CardTitle>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`]} />
                <Legend />
                <Bar dataKey="present" name="Present" stackId="a" fill="#4ade80" />
                <Bar dataKey="halfDay" name="Half Day" stackId="a" fill="#facc15" />
                <Bar dataKey="absent" name="Absent" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Attendance Records */}
      <Card>
        <CardContent className="pt-6">
          <CardTitle className="mb-4">Recent Attendance Records</CardTitle>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableCaption>Showing up to 20 recent attendance records</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.slice(0, 20).map((record) => {
                  const staffInfo = staff?.find(s => s.id === record.staffId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-medium">{record.staffName}</TableCell>
                      <TableCell>{staffInfo?.role || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            record.status === 'Present' ? 'default' :
                            record.status === 'Half-day' ? 'outline' : 'destructive'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.clockIn 
                          ? format(new Date(record.clockIn), 'hh:mm a') 
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {record.clockOut 
                          ? format(new Date(record.clockOut), 'hh:mm a') 
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No attendance records found for the selected date range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

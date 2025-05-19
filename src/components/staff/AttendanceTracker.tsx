
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Attendance, StaffMember } from '@/types';
import sheetService from '@/services/sheetService';
import { format } from 'date-fns';

export function AttendanceTracker() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showPastDays, setShowPastDays] = useState(7);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [staffData, attendanceData] = await Promise.all([
          sheetService.getStaffMembers(),
          sheetService.getAttendance()
        ]);
        
        setStaffMembers(staffData);
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Failed to load staff data:", error);
        toast({
          title: "Error",
          description: "Failed to load staff data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Generate past dates
  const pastDates = Array.from({ length: showPastDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  // Handle clock in/out
  const handleClockIn = async (staffId: string) => {
    try {
      const staffMember = staffMembers.find(s => s.id === staffId);
      
      if (!staffMember) {
        toast({
          title: "Error",
          description: "Staff member not found.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if already clocked in today
      const todayAttendance = attendance.find(
        a => a.staffId === staffId && a.date === selectedDate
      );
      
      if (todayAttendance && todayAttendance.clockIn) {
        toast({
          title: "Already Clocked In",
          description: `${staffMember.name} has already clocked in today.`,
          variant: "destructive"
        });
        return;
      }
      
      const newAttendance: Attendance = {
        id: `ATT-${Date.now().toString().slice(-8)}`,
        staffId,
        staffName: staffMember.name,
        clockIn: new Date().toISOString(),
        date: selectedDate,
        status: 'Present'
      };
      
      await sheetService.recordAttendance(newAttendance);
      
      // Update local state
      setAttendance([...attendance, newAttendance]);
      
      toast({
        title: "Success",
        description: `${staffMember.name} clocked in successfully.`
      });
    } catch (error) {
      console.error("Failed to clock in:", error);
      toast({
        title: "Error",
        description: "Failed to record clock in. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleClockOut = async (staffId: string) => {
    try {
      const staffMember = staffMembers.find(s => s.id === staffId);
      
      if (!staffMember) {
        toast({
          title: "Error",
          description: "Staff member not found.",
          variant: "destructive"
        });
        return;
      }
      
      // Find the attendance record
      const attendanceIndex = attendance.findIndex(
        a => a.staffId === staffId && a.date === selectedDate
      );
      
      if (attendanceIndex === -1) {
        toast({
          title: "Not Clocked In",
          description: `${staffMember.name} has not clocked in today.`,
          variant: "destructive"
        });
        return;
      }
      
      if (attendance[attendanceIndex].clockOut) {
        toast({
          title: "Already Clocked Out",
          description: `${staffMember.name} has already clocked out today.`,
          variant: "destructive"
        });
        return;
      }
      
      // Update attendance record
      const updatedAttendance = [...attendance];
      updatedAttendance[attendanceIndex] = {
        ...updatedAttendance[attendanceIndex],
        clockOut: new Date().toISOString()
      };
      
      await sheetService.recordAttendance(updatedAttendance[attendanceIndex]);
      
      // Update local state
      setAttendance(updatedAttendance);
      
      toast({
        title: "Success",
        description: `${staffMember.name} clocked out successfully.`
      });
    } catch (error) {
      console.error("Failed to clock out:", error);
      toast({
        title: "Error",
        description: "Failed to record clock out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getAttendanceStatus = (staffId: string, date: string): Attendance | undefined => {
    return attendance.find(a => a.staffId === staffId && a.date === date);
  };
  
  const formatTimeFromISO = (isoString?: string): string => {
    if (!isoString) return '-';
    return format(new Date(isoString), 'hh:mm a');
  };

  return (
    <Card className="w-full scale-in-center">
      <CardHeader>
        <CardTitle>Staff Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select 
            value={selectedDate} 
            onValueChange={setSelectedDate}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {pastDates.map(date => (
                <SelectItem key={date} value={date}>
                  {date === format(new Date(), 'yyyy-MM-dd') 
                    ? 'Today' 
                    : date === format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
                      ? 'Yesterday'
                      : date
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={showPastDays.toString()} 
            onValueChange={(val) => setShowPastDays(parseInt(val))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Show past days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-shimmer inline-block h-8 w-3/4 rounded-md bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:800px_100%]"></div>
            <div className="animate-shimmer inline-block h-40 w-full mt-4 rounded-md bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:800px_100%]"></div>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  staffMembers.map((staff) => {
                    const attendanceRecord = getAttendanceStatus(staff.id, selectedDate);
                    const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
                    
                    return (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>
                          {attendanceRecord ? (
                            <Badge 
                              variant={
                                attendanceRecord.status === 'Present' ? 'default' :
                                attendanceRecord.status === 'Half-day' ? 'outline' : 'destructive'
                              }
                            >
                              {attendanceRecord.status}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Recorded</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatTimeFromISO(attendanceRecord?.clockIn)}</TableCell>
                        <TableCell>{formatTimeFromISO(attendanceRecord?.clockOut)}</TableCell>
                        <TableCell className="text-right">
                          {isToday && (
                            <>
                              {!attendanceRecord?.clockIn && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleClockIn(staff.id)}
                                >
                                  Clock In
                                </Button>
                              )}
                              
                              {attendanceRecord?.clockIn && !attendanceRecord?.clockOut && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleClockOut(staff.id)}
                                >
                                  Clock Out
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

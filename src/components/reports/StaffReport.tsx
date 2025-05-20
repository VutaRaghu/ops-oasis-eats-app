
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label, Legend } from "recharts";

// For TypeScript type checking
import { StaffMember, Attendance } from "@/types";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StaffReportProps {
  staff: StaffMember[];
  attendance: Attendance[];
  startDate: Date;
  endDate: Date;
}

const StaffReport: React.FC<StaffReportProps> = ({
  staff,
  attendance,
  startDate,
  endDate,
}) => {
  // Filter attendance records by date range
  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });

  // Calculate attendance metrics
  const attendanceStats = staff.map((staffMember) => {
    const staffAttendance = filteredAttendance.filter(
      (record) => record.staffId === staffMember.id
    );
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysPresent = staffAttendance.filter((record) => record.status === "Present").length;
    const daysAbsent = staffAttendance.filter((record) => record.status === "Absent").length;
    const daysLate = staffAttendance.filter((record) => record.status === "Late").length;
    
    const attendanceRate = (daysPresent / totalDays) * 100;
    
    return {
      id: staffMember.id,
      name: staffMember.name,
      role: staffMember.role,
      totalDays,
      daysPresent,
      daysAbsent,
      daysLate,
      attendanceRate,
    };
  });

  // Prepare data for pie chart
  const roleDistribution = staff.reduce((acc, member) => {
    const role = member.role;
    const existingRole = acc.find((item) => item.name === role);
    
    if (existingRole) {
      existingRole.value += 1;
    } else {
      acc.push({ name: role, value: 1 });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>
          Staff attendance and performance metrics from{" "}
          {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Role Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value} staff`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Staff Attendance Rate</h3>
            <div className="space-y-4">
              {attendanceStats.slice(0, 5).map((stat) => (
                <div key={stat.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{stat.name}</span>
                    <span className="text-sm font-medium">
                      {stat.attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={stat.attendanceRate}
                    className="h-2"
                    indicatorClassName={
                      stat.attendanceRate > 90
                        ? "bg-green-500"
                        : stat.attendanceRate > 75
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Staff Attendance Details</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Days Present</TableHead>
                  <TableHead className="text-right">Days Absent</TableHead>
                  <TableHead className="text-right">Days Late</TableHead>
                  <TableHead className="text-right">Attendance Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell>{stat.role}</TableCell>
                    <TableCell className="text-right">{stat.daysPresent}</TableCell>
                    <TableCell className="text-right">{stat.daysAbsent}</TableCell>
                    <TableCell className="text-right">{stat.daysLate}</TableCell>
                    <TableCell className="text-right">
                      {stat.attendanceRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffReport;

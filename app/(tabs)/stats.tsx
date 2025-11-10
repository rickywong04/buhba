import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  useColorScheme, 
  View, 
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {
    BobaEntry,
    getAllBobaEntries,
    getBobaCount,
    getMostFrequentFlavor,
    getTotalSpent
} from '../../utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 200;
const BAR_WIDTH = (CHART_WIDTH - 60) / 31; // 31 days max

type TimePeriod = 'week' | 'month' | 'year' | 'all-time';
type ViewType = 'spending' | 'flavors';

interface DailyData {
  date: string;
  day: number;
  cost: number;
  formattedDate: string;
}

interface FlavorData {
  flavor: string;
  count: number;
  totalCost: number;
  percentage: number;
}

export default function StatsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const isFocused = useIsFocused();
  
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [viewType, setViewType] = useState<ViewType>('spending');
  const [selectedBar, setSelectedBar] = useState<DailyData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const [entries, setEntries] = useState<BobaEntry[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [flavorCount, setFlavorCount] = useState(0);
  const [pearlsConsumed, setPearlsConsumed] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [topFlavor, setTopFlavor] = useState({ flavor: 'None', count: 0 });
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [flavorData, setFlavorData] = useState<FlavorData[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (isFocused) {
      loadStats();
    }
  }, [isFocused]);

  useEffect(() => {
    if (entries.length > 0) {
      filterDataByTimePeriod();
    }
  }, [timePeriod, entries]);

  const loadStats = async () => {
    try {
      const allEntries = await getAllBobaEntries();
      const count = await getBobaCount();
      const total = await getTotalSpent();
      const favFlavor = await getMostFrequentFlavor();
      
      setEntries(allEntries);
      setDrinkCount(count);
      setTotalSpent(total);
      setTopFlavor(favFlavor);
      setAvgPrice(count > 0 ? total / count : 0);
      
      // Estimate pearls consumed (average 50 pearls per drink)
      setPearlsConsumed(count * 50);
      
      // Count unique flavors
      const uniqueFlavors = new Set(allEntries.map(entry => entry.flavor));
      setFlavorCount(uniqueFlavors.size);
      
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterDataByTimePeriod = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timePeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }
    
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    });
    
    // Calculate daily spending data
    const dailyMap: Record<string, number> = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dateKey = date.toISOString().split('T')[0];
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + entry.price;
    });
    
    const dailyArray: DailyData[] = Object.entries(dailyMap).map(([date, cost]) => {
      const d = new Date(date);
      return {
        date,
        day: d.getDate(),
        cost,
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setDailyData(dailyArray);
    
    // Calculate flavor distribution (case-insensitive)
    const flavorMap: Record<string, { count: number; totalCost: number; originalName: string }> = {};
    filteredEntries.forEach(entry => {
      const normalized = entry.flavor.trim().toLowerCase();
      if (!flavorMap[normalized]) {
        flavorMap[normalized] = { count: 0, totalCost: 0, originalName: entry.flavor };
      }
      flavorMap[normalized].count++;
      flavorMap[normalized].totalCost += entry.price;
    });

    const total = filteredEntries.length;
    const flavorArray: FlavorData[] = Object.entries(flavorMap)
      .map(([_, data]) => ({
        flavor: data.originalName,
        count: data.count,
        totalCost: data.totalCost,
        percentage: (data.count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
    
    setFlavorData(flavorArray);
    
    // Set date range
    if (dailyArray.length > 0) {
      const start = new Date(dailyArray[0].date);
      const end = new Date(dailyArray[dailyArray.length - 1].date);
      setDateRange({
        start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
  };

  const getMaxCost = () => {
    if (dailyData.length === 0) return 10;
    const max = Math.max(...dailyData.map(d => d.cost));
    return max > 0 ? max : 10;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return '';
    return `${dateRange.start} - ${dateRange.end}`;
  };


  const renderBarChart = () => {
    const maxCost = getMaxCost();
    const maxHeight = CHART_HEIGHT - 60;
    const barSpacing = dailyData.length > 0 ? (CHART_WIDTH - 60) / dailyData.length : BAR_WIDTH;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Y-axis labels */}
            <SvgText
              x={CHART_WIDTH - 10}
              y={20}
              fontSize="12"
              fill={colors.primaryColor}
              textAnchor="end"
            >
              ${maxCost.toFixed(0)}
            </SvgText>
            <SvgText
              x={CHART_WIDTH - 10}
              y={CHART_HEIGHT / 2}
              fontSize="12"
              fill={colors.primaryColor}
              textAnchor="end"
            >
              ${(maxCost / 2).toFixed(0)}
            </SvgText>

            {/* Bars */}
            {dailyData.map((data, index) => {
              const barHeight = (data.cost / maxCost) * maxHeight;
              const x = 50 + (index * barSpacing);
              const y = CHART_HEIGHT - 40 - barHeight;
              const barWidth = Math.min(barSpacing * 0.8, 20);

              return (
                <React.Fragment key={data.date}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={colors.accent}
                    rx={4}
                  />
                  {/* Day label */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={CHART_HEIGHT - 20}
                    fontSize="10"
                    fill={colors.primaryColor}
                    textAnchor="middle"
                  >
                    {data.day}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
          
          {/* Touchable areas for bars */}
          {dailyData.map((data, index) => {
            const barHeight = (data.cost / maxCost) * maxHeight;
            const x = 50 + (index * barSpacing);
            const y = CHART_HEIGHT - 40 - barHeight;
            const barWidth = Math.min(barSpacing * 0.8, 20);
            
            return (
              <TouchableOpacity
                key={`touch-${data.date}`}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y - 10,
                  width: barWidth,
                  height: barHeight + 50,
                }}
                onPress={() => {
                  setSelectedBar(data);
                  setTooltipPosition({ 
                    x: x + barWidth / 2 + 16, // Offset from left edge
                    y: y - 40 
                  });
                }}
                activeOpacity={0.7}
              />
            );
          })}
        </View>
        
        {/* Tooltip */}
        {selectedBar && (
          <View
            style={[
              styles.tooltip,
              {
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                backgroundColor: colors.card,
              }
            ]}
          >
            <Text style={[styles.tooltipCost, { color: colors.text }]}>{formatPrice(selectedBar.cost)}</Text>
            <Text style={[styles.tooltipDate, { color: colors.text }]}>{selectedBar.formattedDate}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderPieChart = () => {
    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;
    const innerRadius = 50;
    
    let currentAngle = -90; // Start from top
    
    const chartColors = ['#EE961F', '#583B39', '#85695D', '#FAF0E2', '#C4A57B'];
    
    const paths = flavorData.map((data, index) => {
      const angle = (data.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = centerY + innerRadius * Math.sin(startAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
      
      currentAngle += angle;
      
      return { path, color: chartColors[index % chartColors.length], data };
    });
    
    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size} style={{ alignSelf: 'center' }}>
          {paths.map((segment, index) => (
            <Path
              key={index}
              d={segment.path}
              fill={segment.color}
            />
          ))}
        </Svg>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          {flavorData.map((data, index) => (
            <View key={data.flavor} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: chartColors[index % chartColors.length] }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>{data.flavor}</Text>
              <Text style={[styles.legendPercentage, { color: colors.text }]}>{Math.round(data.percentage)}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome name="bars" size={24} color={colors.primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerLogo, { color: colors.primaryColor }]}>buhba</Text>
        <TouchableOpacity>
          <View style={[styles.profileIcon, { backgroundColor: colors.secondaryColor }]}>
            <FontAwesome name="user" size={20} color={colors.primaryColor} />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Your Boba Stats</Text>
      
      {/* Go-To Flavor Card */}
      <LinearGradient
        colors={['#FFB6C1', '#FF6347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.flavorCard}
      >
        <View style={styles.flavorCardContent}>
          <View>
            <Text style={styles.flavorCardTitle}>Your {currentYear} Go-To Flavor is...</Text>
            <Text style={styles.flavorCardFlavor}>{topFlavor.flavor}</Text>
            <Text style={styles.flavorCardSubtext}>Enjoyed {topFlavor.count} {topFlavor.count === 1 ? 'time' : 'times'}</Text>
          </View>
          <FontAwesome name="heart" size={40} color="white" style={{ marginLeft: 20 }} />
        </View>
      </LinearGradient>
      
      {/* Time Period Selector */}
      <View style={[styles.timePeriodContainer, { backgroundColor: colors.secondaryColor }]}>
        {(['week', 'month', 'year', 'all-time'] as TimePeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timePeriodButton,
              timePeriod === period && [styles.timePeriodButtonActive, { backgroundColor: colors.accent }]
            ]}
            onPress={() => setTimePeriod(period)}
          >
            <Text style={[
              styles.timePeriodText,
              { color: colors.text },
              timePeriod === period && styles.timePeriodTextActive
            ]}>
              {period === 'week' ? 'This week' : period === 'month' ? 'Month' : period === 'year' ? 'Year' : 'All-Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Statistics Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <FontAwesome name="coffee" size={24} color={colors.primaryColor} />
          <Text style={[styles.statValue, { color: colors.text }]}>{drinkCount}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>DRINKS</Text>
        </View>

        <View style={styles.statCard}>
          <FontAwesome name="glass" size={24} color={colors.primaryColor} />
          <Text style={[styles.statValue, { color: colors.text }]}>{flavorCount}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>FLAVORS</Text>
        </View>

        <View style={styles.statCard}>
          <FontAwesome name="circle" size={24} color={colors.primaryColor} />
          <Text style={[styles.statValue, { color: colors.text }]}>{pearlsConsumed}</Text>
          <View style={styles.statLabelContainer}>
            <Text style={[styles.statLabel, { color: colors.text }]}>PEARLS{'\n'}CONSUMED</Text>
            <FontAwesome name="question-circle" size={12} color={colors.primaryColor} style={styles.questionIcon} />
          </View>
        </View>
      </View>

      {/* Spending Section */}
      <View style={styles.spendingSection}>
        <View style={styles.spendingRow}>
          <FontAwesome name="credit-card" size={20} color={colors.primaryColor} />
          <Text style={[styles.spendingLabel, { color: colors.text }]}>TOTAL SPENDING</Text>
        </View>
        <Text style={[styles.spendingAmount, { color: colors.text }]}>{formatPrice(totalSpent)}</Text>
        <Text style={[styles.avgPrice, { color: colors.text }]}>AVG. PRICE PER BOBA: {formatPrice(avgPrice)}</Text>
      </View>
      
      {/* Chart Section */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={[styles.dateRange, { color: colors.text }]}>{formatDateRange()}</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, { backgroundColor: colors.accent }]}
            onPress={() => setViewType(viewType === 'spending' ? 'flavors' : 'spending')}
          >
            <Text style={styles.dropdownText}>{viewType === 'spending' ? 'Spending' : 'Flavors'}</Text>
            <FontAwesome name="chevron-down" size={14} color="white" />
          </TouchableOpacity>
        </View>
        
        {viewType === 'spending' && dailyData.length > 0 && renderBarChart()}

        {viewType === 'flavors' && flavorData.length > 0 && renderPieChart()}
      </View>
      
      {/* Reset tooltip when clicking outside */}
      {selectedBar && (
        <Pressable
          style={styles.overlay}
          onPress={() => setSelectedBar(null)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  headerLogo: {
    fontSize: 24,
    fontFamily: 'Jua_400Regular',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
  },
  flavorCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  flavorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flavorCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'white',
    marginBottom: 8,
  },
  flavorCardFlavor: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    marginBottom: 4,
  },
  flavorCardSubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'white',
    opacity: 0.9,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePeriodButtonActive: {},
  timePeriodText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  timePeriodTextActive: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 12,
  },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  questionIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  spendingSection: {
    marginBottom: 20,
  },
  spendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spendingLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
  spendingAmount: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  avgPrice: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  chartSection: {
    marginTop: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateRange: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dropdownText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 6,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  chartWrapper: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipCost: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  tooltipDate: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  legendPercentage: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    opacity: 0.6,
  },
});

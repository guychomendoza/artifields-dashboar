import { Page, Text, View, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

const processContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    let listItems: React.ReactNode[] = [];

    const processBoldText = (content: string) =>
        content.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <Text key={index} style={styles.bold}>
                        {part.slice(2, -2)}
                    </Text>
                );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return (
                    <Text key={index} style={styles.bold}>
                        {part.slice(1, -1)}
                    </Text>
                );
            }
            return part;
        });

    const processList = () => {
        if (listItems.length > 0) {
            elements.push(<View key={elements.length}>{listItems}</View>);
            listItems = [];
        }
    };

    const processListItem = (content: string, prefix: string) => (
        <Text key={`list-${listItems.length}`} style={styles.listItem}>
            <Text>{prefix} </Text>
            {processBoldText(content)}
        </Text>
    );

    lines.forEach((line, index) => {
        if (line.startsWith('### ')) {
            processList();
            elements.push(
                <Text key={index} style={styles.sectionTitle}>
                    {line.slice(4)}
                </Text>
            );
        } else if (line.startsWith('#### ')) {
            processList();
            const titleContent = line.slice(5);
            const match = titleContent.match(/^(\d+\.\s*)(\*\*.*\*\*)$/);
            if (match) {
                const [, number, boldText] = match;
                elements.push(
                    <Text key={index} style={styles.sectionSubtitle}>
                        {number}
                        {boldText.slice(2, -2)}
                    </Text>
                );
            } else {
                elements.push(
                    <Text key={index} style={styles.sectionSubtitle}>
                        {titleContent}
                    </Text>
                );
            }
        } else if (line.startsWith('- ')) {
            listItems.push(processListItem(line.slice(2), '•'));
        } else if (/^\d+\.\s/.test(line)) {
            const [number, ...rest] = line.split(/\.\s/);
            listItems.push(processListItem(rest.join('. '), `${number}.`));
        } else if (line.trim() !== '') {
            processList();
            elements.push(
                <Text key={index} style={styles.content}>
                    {processBoldText(line)}
                </Text>
            );
        }
    });

    processList(); // Process any remaining list items

    return elements;
};

export const SensorReportPDF = ({
    plotSrc,
    title,
    content,
}: {
    plotSrc: string;
    title: string;
    content: string;
}) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            <View style={styles.header}>
                <Image style={styles.headerLogo} src="/logo/ArtiFields_Logo.png" />
            </View>

            <Text style={styles.title}>{title}</Text>

            <Image src={plotSrc} style={styles.plotImage} />

            {processContent(content)}
        </Page>
    </Document>
);

Font.register({
    family: 'Open Sans',
    fonts: [
        {
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
            fontWeight: 400,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
            fontWeight: 600,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf',
            fontWeight: 700,
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Open Sans',
        backgroundColor: 'white',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottom: '1pt solid #eee',
        paddingBottom: 20,
    },
    headerLogo: {
        width: 180,
        height: 101,
        objectFit: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#2C3E50',
    },
    content: {
        fontSize: 11,
        lineHeight: 1.6,
        marginBottom: 8,
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#2C3E50',
        borderBottom: '1pt solid #eee',
        paddingBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
        color: '#34495E',
    },
    listItem: {
        fontSize: 11,
        marginBottom: 5,
        lineHeight: 1.6,
        textAlign: 'justify',
    },
    plotImage: {
        marginVertical: 10,
        width: '100%',
        height: 300, // Fixed height for consistency
        objectFit: 'contain',
    },
});
